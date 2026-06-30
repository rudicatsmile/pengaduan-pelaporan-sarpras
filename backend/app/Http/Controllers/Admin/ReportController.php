<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        return redirect()->back()->with('success', 'Laporan berhasil didelegasikan');
    }
}
