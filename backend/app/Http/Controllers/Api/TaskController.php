<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Report::with(['category', 'room'])
            ->where('assigned_to', $request->user()->id)
            ->latest()
            ->get();
            
        return response()->json([
            'message' => 'Berhasil mengambil daftar tugas',
            'data' => $tasks
        ]);
    }

    public function process(Request $request, $id)
    {
        $report = Report::with('user')->where('id', $id)
            ->where('assigned_to', $request->user()->id)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Tugas tidak ditemukan atau bukan milik Anda'], 404);
        }

        $report->update(['status' => 'proses']);

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'Petugas mulai memproses tugas',
        ]);

        if ($report->user && $report->user->phone) {
            \App\Services\WablasService::send(
                $report->user->phone, 
                "Halo {$report->user->name}, laporan Anda (ID: {$report->id}) saat ini sedang ditindaklanjuti/diproses oleh petugas."
            );
        }

        return response()->json(['message' => 'Status tugas diubah menjadi proses']);
    }

    public function resolve(Request $request, $id)
    {
        $report = Report::with('user')->where('id', $id)
            ->where('assigned_to', $request->user()->id)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Tugas tidak ditemukan atau bukan milik Anda'], 404);
        }

        $request->validate([
            'resolution_notes' => 'nullable|string',
            'attachment' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $report->update(['status' => 'selesai']);
        
        $actionText = 'Petugas menyelesaikan tugas';
        if ($request->resolution_notes) {
            $actionText .= ' dengan catatan: ' . $request->resolution_notes;
        }

        $report->activities()->create([
            'user_id' => $request->user()->id,
            'action' => $actionText,
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments', 'public');
            $report->attachments()->create([
                'file_path' => asset('storage/' . $path),
                'file_type' => 'image',
            ]);
        }

        if ($report->user && $report->user->phone) {
            \App\Services\WablasService::send(
                $report->user->phone, 
                "Halo {$report->user->name}, laporan Anda (ID: {$report->id}) TELAH SELESAI diperbaiki. Terima kasih atas partisipasi Anda!"
            );
        }

        return response()->json(['message' => 'Tugas berhasil diselesaikan']);
    }
}
