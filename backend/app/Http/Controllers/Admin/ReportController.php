<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['user', 'category', 'room'])->latest()->get();
        return Inertia::render('Admin/Report/Index', [
            'reports' => $reports
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'category', 'room', 'attachments', 'activities.user'])->findOrFail($id);
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
}
