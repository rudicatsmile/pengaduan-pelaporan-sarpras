<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Report::with(['user', 'category', 'room.floor.building'])->latest();

        if ($user->hasRole('petugas')) {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_to', $user->id);
            });
        } elseif ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->where(function($q) use ($allowedBuildingIds) {
                    $q->whereHas('room.floor', function($q2) use ($allowedBuildingIds) {
                        $q2->whereIn('building_id', $allowedBuildingIds);
                    })->orWhereNull('room_id');
                });
            }
        } else {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('building_id')) {
            $query->whereHas('room.floor', function($q) use ($request) {
                $q->where('building_id', $request->building_id);
            });
        }

        if ($request->filled('job_category_id')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('job_category_id', $request->job_category_id);
            });
        }

        $buildingsQuery = \App\Models\Building::query();
        if ($user->hasAnyRole(['admin', 'supervisor']) && $allowedBuildingIds !== null) {
            $buildingsQuery->whereIn('id', $allowedBuildingIds);
        }
        $buildings = $buildingsQuery->get(['id', 'name']);
        
        $jobCategories = \App\Models\JobCategory::all();

        return Inertia::render('Admin/Report/Index', [
            'reports' => $query->get(),
            'buildings' => $buildings,
            'jobCategories' => $jobCategories,
            'filters' => request()->only(['building_id', 'job_category_id']),
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'category', 'room.floor.building', 'attachments', 'activities.user'])->findOrFail($id);
        $user = auth()->user();

        // Check ownership/assignment for non-admins
        if (!$user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            if ($report->user_id !== $user->id && $report->assigned_to !== $user->id) {
                abort(403, 'Unauthorized');
            }
        }

        // Check building access for admin
        if ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $report->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    abort(403, 'Unauthorized (Building not assigned)');
                }
            }
        }

        $petugas = User::role('petugas')->get();

        return Inertia::render('Admin/Report/Show', [
            'report' => $report,
            'petugas' => $petugas,
        ]);
    }

    public function verify(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $report->update([
            'status' => 'diverifikasi',
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan diverifikasi',
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil diverifikasi');
    }

    public function delegate(Request $request, $id)
    {
        $request->validate(['petugas_id' => 'required|exists:users,id']);

        $report = Report::findOrFail($id);
        $report->update([
            'status' => 'didelegasikan',
            'assigned_to' => $request->petugas_id,
        ]);

        $petugas = User::find($request->petugas_id);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan didelegasikan ke ' . $petugas->name,
        ]);

        if ($petugas->phone) {
            \App\Services\WablasService::send(
                $petugas->phone, 
                "Halo {$petugas->name}, Anda mendapat delegasi tugas baru (Laporan ID: {$report->id}). Silakan cek aplikasi untuk detailnya."
            );
        }

        return redirect()->back()->with('success', 'Laporan berhasil didelegasikan');
    }

    public function process(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        
        // Cek apakah user yang login adalah petugas yang ditugaskan
        if ($report->assigned_to !== $request->user()->id && !$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return back()->with('error', 'Anda tidak berhak memproses laporan ini.');
        }

        $report->update([
            'status' => 'dalam_proses',
        ]);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Petugas mulai mengerjakan perbaikan',
        ]);

        return redirect()->back()->with('success', 'Status laporan diubah menjadi Dalam Proses');
    }

    public function resolve(Request $request, $id)
    {
        $request->validate(['resolution_notes' => 'required|string']);

        $report = Report::findOrFail($id);

        if ($report->assigned_to !== $request->user()->id && !$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return back()->with('error', 'Anda tidak berhak menyelesaikan laporan ini.');
        }

        $report->update([
            'status' => 'selesai',
            'resolved_at' => now(),
        ]);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan diselesaikan: ' . $request->resolution_notes,
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil diselesaikan');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user->hasRole('super_admin')) {
            abort(403, 'Unauthorized');
        }

        $report = Report::with(['attachments', 'activities'])->findOrFail($id);

        // Delete physical files
        if ($report->attachments) {
            foreach ($report->attachments as $attachment) {
                $path = $attachment->getRawOriginal('file_path');
                if ($path && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
            $report->attachments()->delete();
        }

        if ($report->activities) {
            $report->activities()->delete();
        }

        $report->delete();

        return redirect()->back()->with('success', 'Laporan berhasil dihapus.');
    }
}
