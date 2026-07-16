<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    use \App\Traits\BuildingAccess;
    use \App\Traits\NotifyAdmins;

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:pengaduan_qr,pelaporan_umum',
            'room_id' => 'required_if:type,pengaduan_qr|exists:rooms,id',
            'location_text' => 'required_if:type,pelaporan_umum|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'attachments' => 'required|array|min:1',
            'attachments.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        try {
            DB::beginTransaction();

            $report = Report::create([
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'room_id' => $request->type === 'pengaduan_qr' ? $request->room_id : null,
                'location_text' => $request->type === 'pelaporan_umum' ? $request->location_text : null,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'status' => 'baru',
            ]);

            // Save activities log
            $report->activities()->create([
                'user_id' => $request->user()->id,
                'action' => 'Laporan dibuat',
            ]);

            if ($request->user()->phone) {
                \App\Services\WablasService::send(
                    $request->user()->phone, 
                    "Halo {$request->user()->name}, laporan Anda (ID: {$report->id}) berhasil diterima dan sedang menunggu verifikasi admin."
                );
            }

            // Upload attachments
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('reports/issues', 'public');
                    ReportAttachment::create([
                        'report_id' => $report->id,
                        'file_path' => $path,
                        'type' => 'issue',
                    ]);
                }
            }

            DB::commit();

            // Send notification to admins
            try {
                $this->notifyAdmins($report);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to notify admins: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Laporan berhasil disubmit',
                'data' => $report->load('attachments')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Report Submit Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal submit laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Report::with(['category', 'room.floor.building', 'assignedUser'])->latest();

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

        return response()->json([
            'message' => 'Berhasil mengambil daftar laporan',
            'data' => $query->paginate(10)
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Report::with(['category', 'room', 'attachments', 'activities', 'assignedUser'])->where('id', $id);

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

        $report = $query->first();

        if (!$report) {
            return response()->json(['message' => 'Laporan tidak ditemukan atau Anda tidak memiliki akses'], 404);
        }

        return response()->json([
            'message' => 'Berhasil mengambil detail laporan',
            'data' => $report
        ]);
    }

    public function verify(Request $request, $id)
    {
        if (!$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report = Report::findOrFail($id);
        
        if ($request->user()->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $report->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        $report->update([
            'status' => 'diverifikasi',
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan diverifikasi',
        ]);

        return response()->json(['message' => 'Laporan berhasil diverifikasi']);
    }

    public function delegate(Request $request, $id)
    {
        if (!$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'petugas_id' => 'required|exists:users,id',
            'expected_completion_time' => 'nullable|date',
        ]);

        $report = Report::findOrFail($id);
        
        if ($request->user()->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $report->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        $report->update([
            'status' => 'didelegasikan',
            'assigned_to' => $request->petugas_id,
            'expected_completion_time' => $request->expected_completion_time,
        ]);

        $petugas = User::find($request->petugas_id);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan didelegasikan ke ' . $petugas->name . ($request->expected_completion_time ? ' dengan estimasi selesai ' . \Carbon\Carbon::parse($request->expected_completion_time)->format('d-m-Y H:i') : ''),
        ]);

        if ($petugas->phone) {
            \App\Services\WablasService::send(
                $petugas->phone, 
                "Halo {$petugas->name}, Anda mendapat delegasi tugas baru (Laporan ID: {$report->id}). Silakan cek aplikasi untuk detailnya."
            );
        }

        $pelapor = $report->user;
        if ($pelapor && $pelapor->phone) {
             \App\Services\WablasService::send(
                 $pelapor->phone,
                 "Halo {$pelapor->name}, Laporan Anda (ID: {$report->id}) telah diproses dan didelegasikan kepada teknisi {$petugas->name}." . 
                 ($request->expected_completion_time ? " Estimasi selesai: " . \Carbon\Carbon::parse($request->expected_completion_time)->format('d-m-Y H:i') : "")
             );
        }

        return response()->json(['message' => 'Laporan berhasil didelegasikan']);
    }

    public function process(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        
        if ($report->assigned_to !== $request->user()->id && !$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return response()->json(['message' => 'Anda tidak berhak memproses laporan ini.'], 403);
        }

        $report->update(['status' => 'dalam_proses']);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Petugas mulai mengerjakan perbaikan',
        ]);

        return response()->json(['message' => 'Status laporan diubah menjadi Dalam Proses']);
    }

    public function resolve(Request $request, $id)
    {
        $request->validate(['resolution_notes' => 'nullable|string']);
        $report = Report::findOrFail($id);

        if ($report->assigned_to !== $request->user()->id && !$request->user()->hasAnyRole(['admin', 'super_admin'])) {
            return response()->json(['message' => 'Anda tidak berhak menyelesaikan laporan ini.'], 403);
        }

        $report->update([
            'status' => 'selesai',
            'resolved_at' => now(),
        ]);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Laporan diselesaikan: ' . $request->resolution_notes,
        ]);

        $pelapor = $report->user;
        if ($pelapor && $pelapor->phone) {
             \App\Services\WablasService::send(
                 $pelapor->phone,
                 "Halo {$pelapor->name}, Laporan Anda (ID: {$report->id}) telah selesai ditangani. Terima kasih."
             );
        }

        return response()->json(['message' => 'Laporan berhasil diselesaikan']);
    }
}
