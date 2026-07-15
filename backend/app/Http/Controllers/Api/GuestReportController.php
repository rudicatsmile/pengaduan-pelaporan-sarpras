<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GuestReportController extends Controller
{
    use \App\Traits\NotifyAdmins;

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:pengaduan_qr,pelaporan_umum',
            'room_id' => 'required_if:type,pengaduan_qr|exists:rooms,id',
            'location_text' => 'required_if:type,pelaporan_umum|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:20',
            'attachments' => 'required|array|min:1',
            'attachments.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $report = Report::create([
                'user_id' => null, // Guest
                'type' => $request->type,
                'room_id' => $request->type === 'pengaduan_qr' ? $request->room_id : null,
                'location_text' => $request->type === 'pelaporan_umum' ? $request->location_text : null,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'guest_name' => $request->guest_name,
                'guest_phone' => $request->guest_phone,
                'status' => 'baru',
            ]);

            // Save activities log
            $report->activities()->create([
                'user_id' => null, // Guest
                'action' => 'Laporan dibuat oleh Pengunjung Anonim: ' . $request->guest_name,
            ]);

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
            \Illuminate\Support\Facades\Log::error('Guest Report Submit Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal submit laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
