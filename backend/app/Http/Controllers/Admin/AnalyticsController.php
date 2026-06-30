<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    public function index()
    {
        // Monthly trend (last 6 months)
        $monthlyTrend = Report::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw("COUNT(id) as total")
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->get();

        // Status breakdown
        $statusBreakdown = Report::select('status', DB::raw("COUNT(id) as total"))
        ->groupBy('status')
        ->get();

        // Category breakdown
        $categoryBreakdown = Report::join('categories', 'reports.category_id', '=', 'categories.id')
        ->select('categories.name as category', DB::raw("COUNT(reports.id) as total"))
        ->groupBy('categories.name')
        ->get();

        return Inertia::render('Admin/Analytics/Index', [
            'monthlyTrend' => $monthlyTrend,
            'statusBreakdown' => $statusBreakdown,
            'categoryBreakdown' => $categoryBreakdown,
        ]);
    }

    public function exportCsv()
    {
        $reports = Report::with(['user', 'category', 'room', 'assignedToPetugas'])->latest()->get();

        $headers = [
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=laporan-sarpras-' . date('Y-m-d') . '.csv',
            'Expires'             => '0',
            'Pragma'              => 'public'
        ];

        $callback = function () use ($reports) {
            $FH = fopen('php://output', 'w');
            
            // Add BOM for Excel UTF-8 reading
            fputs($FH, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF)));
            
            fputcsv($FH, [
                'ID', 'Tipe', 'Pelapor', 'Kategori', 'Ruangan/Lokasi', 'Status', 'Petugas', 'Dibuat Pada', 'Selesai Pada'
            ], ';'); // Use semicolon for excel

            foreach ($reports as $report) {
                $selesaiActivity = $report->activities()->where('action', 'like', 'Petugas menyelesaikan tugas%')->first();
                $selesaiPada = $selesaiActivity ? $selesaiActivity->created_at->format('Y-m-d H:i:s') : '-';

                fputcsv($FH, [
                    $report->id,
                    $report->type,
                    $report->user ? $report->user->name : '-',
                    $report->category ? $report->category->name : '-',
                    $report->room ? $report->room->name : ($report->location_text ?? '-'),
                    $report->status,
                    $report->assignedToPetugas ? $report->assignedToPetugas->name : '-',
                    $report->created_at->format('Y-m-d H:i:s'),
                    $selesaiPada
                ], ';');
            }

            fclose($FH);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
