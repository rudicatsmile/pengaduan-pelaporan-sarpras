<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
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

            return response()->json([
                'message' => 'Laporan berhasil disubmit',
                'data' => $report->load('attachments')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal submit laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
