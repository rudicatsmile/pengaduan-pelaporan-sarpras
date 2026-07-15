<?php

namespace App\Traits;

use App\Models\Report;
use App\Models\User;
use App\Services\WablasService;
use Carbon\Carbon;

trait NotifyAdmins
{
    /**
     * Send WhatsApp notification to related admins when a new report is created.
     *
     * @param Report $report
     */
    protected function notifyAdmins(Report $report)
    {
        // Get all super_admin and admin users
        $admins = User::role(['super_admin', 'admin'])->get();

        $targetAdmins = collect();

        if ($report->type === 'pengaduan_qr' && $report->room_id) {
            // Load necessary relationships
            $report->loadMissing('room.floor.building');
            $building = $report->room?->floor?->building;

            if ($building) {
                foreach ($admins as $admin) {
                    // Include if super_admin or admin has manage-building permission
                    if ($admin->hasRole('super_admin') || $admin->hasPermissionTo('manage-building-' . $building->id)) {
                        $targetAdmins->push($admin);
                    }
                }
            } else {
                // Fallback if building somehow not found
                $targetAdmins = $admins;
            }
        } else {
            // Pelaporan umum - send to all admins and super_admins
            $targetAdmins = $admins;
        }

        // Format message
        $typeLabel = $report->type === 'pengaduan_qr' ? 'Pengaduan via QR' : 'Pelaporan Umum';
        
        $reporterName = 'Pengunjung Anonim';
        $reporterPhone = '-';
        if ($report->user_id) {
            $reporterName = $report->user->name;
            $reporterPhone = $report->user->phone ?? '-';
        } elseif ($report->guest_name) {
            $reporterName = $report->guest_name;
            $reporterPhone = $report->guest_phone ?? '-';
        }

        $locationStr = '-';
        if ($report->type === 'pengaduan_qr' && $report->room) {
            $bName = $report->room->floor->building->name ?? '?';
            $fName = $report->room->floor->name ?? '?';
            $rName = $report->room->name ?? '?';
            $locationStr = "{$bName} - {$fName} - {$rName}";
        } elseif ($report->type === 'pelaporan_umum' && $report->location_text) {
            $locationStr = $report->location_text;
        }

        $dateStr = Carbon::parse($report->created_at)->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') . ' WIB';
        $desc = $report->description ?: '-';

        $message = "🚨 *[Pemberitahuan Sistem]*\n"
                 . "Terdapat laporan pengaduan baru yang membutuhkan verifikasi Anda.\n\n"
                 . "📄 *ID Laporan:* #{$report->id} ({$typeLabel})\n"
                 . "👤 *Pelapor:* {$reporterName} ({$reporterPhone})\n"
                 . "📍 *Lokasi:* {$locationStr}\n"
                 . "🕒 *Waktu:* {$dateStr}\n\n"
                 . "📝 *Deskripsi Masalah:*\n"
                 . "{$desc}";

        // Send WhatsApp to each target admin
        foreach ($targetAdmins->unique('id') as $admin) {
            if ($admin->phone) {
                try {
                    WablasService::send($admin->phone, $message);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Failed to notify admin ID {$admin->id}: " . $e->getMessage());
                }
            }
        }
    }

    /**
     * Send WhatsApp notification to related admins when a new Inspection is created.
     *
     * @param \App\Models\Inspection $inspection
     */
    protected function notifyInspection($inspection)
    {
        $admins = User::role(['super_admin', 'admin'])->get();
        $targetAdmins = collect();

        $inspection->loadMissing(['user', 'room.floor.building']);
        $building = $inspection->room?->floor?->building;

        if ($building) {
            foreach ($admins as $admin) {
                if ($admin->hasRole('super_admin')) {
                    $targetAdmins->push($admin);
                } elseif ($admin->hasPermissionTo('manage-building-' . $building->id) && $admin->hasPermissionTo('receive-inspection-alerts')) {
                    $targetAdmins->push($admin);
                }
            }
        } else {
            $targetAdmins = $admins->filter(fn($a) => $a->hasRole('super_admin') || $a->hasPermissionTo('receive-inspection-alerts'));
        }

        $reporterName = $inspection->user ? $inspection->user->name : 'Petugas';
        $bName = $building->name ?? '?';
        $fName = $inspection->room?->floor?->name ?? '?';
        $rName = $inspection->room?->name ?? '?';
        $locationStr = "{$bName} - {$fName} - {$rName}";
        
        $dateStr = Carbon::parse($inspection->created_at)->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') . ' WIB';
        $desc = $inspection->description ?: '-';

        $message = "📝 *[Info Kinerja & Kebersihan]*\n"
                 . "Terdapat Laporan Kinerja baru dari petugas.\n\n"
                 . "📄 *ID Inspeksi:* #{$inspection->id}\n"
                 . "👤 *Petugas:* {$reporterName}\n"
                 . "📍 *Lokasi:* {$locationStr}\n"
                 . "🕒 *Waktu:* {$dateStr}\n"
                 . "📝 *Catatan Kondisi:* {$desc}\n\n"
                 . "Mohon ditinjau melalui dasbor admin Anda.";

        foreach ($targetAdmins->unique('id') as $admin) {
            if ($admin->phone) {
                try { WablasService::send($admin->phone, $message); } 
                catch (\Exception $e) { \Illuminate\Support\Facades\Log::error($e->getMessage()); }
            }
        }
    }

    /**
     * Send WhatsApp notification to related admins when a new AssetInspection is created.
     *
     * @param \App\Models\AssetInspection $inspection
     */
    protected function notifyAssetInspection($inspection)
    {
        $admins = User::role(['super_admin', 'admin'])->get();
        $targetAdmins = collect();

        $inspection->loadMissing(['user', 'room.floor.building', 'details']);
        $building = $inspection->room?->floor?->building;

        if ($building) {
            foreach ($admins as $admin) {
                if ($admin->hasRole('super_admin')) {
                    $targetAdmins->push($admin);
                } elseif ($admin->hasPermissionTo('manage-building-' . $building->id) && $admin->hasPermissionTo('receive-inspection-alerts')) {
                    $targetAdmins->push($admin);
                }
            }
        } else {
            $targetAdmins = $admins->filter(fn($a) => $a->hasRole('super_admin') || $a->hasPermissionTo('receive-inspection-alerts'));
        }

        $reporterName = $inspection->user ? $inspection->user->name : 'Petugas';
        $bName = $building->name ?? '?';
        $fName = $inspection->room?->floor?->name ?? '?';
        $rName = $inspection->room?->name ?? '?';
        $locationStr = "{$bName} - {$fName} - {$rName}";
        
        $dateStr = Carbon::parse($inspection->created_at)->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') . ' WIB';
        
        $total = $inspection->details->count();
        $good = $inspection->details->where('condition', 'baik')->count();
        $bad = $total - $good;
        $summary = "{$good} Aset Baik, {$bad} Aset Rusak/Kurang";

        $notes = $inspection->notes ?: '-';

        $message = "📦 *[Info Inspeksi Aset]*\n"
                 . "Inspeksi aset ruangan telah dilakukan.\n\n"
                 . "📄 *ID Inspeksi:* #{$inspection->id}\n"
                 . "👤 *Petugas:* {$reporterName}\n"
                 . "📍 *Lokasi:* {$locationStr}\n"
                 . "🕒 *Waktu:* {$dateStr}\n"
                 . "📊 *Hasil Pengecekan:* {$summary}\n"
                 . "📝 *Catatan Umum:*\n{$notes}\n\n"
                 . "Mohon ditinjau melalui dasbor admin Anda untuk detail aset.";

        foreach ($targetAdmins->unique('id') as $admin) {
            if ($admin->phone) {
                try { WablasService::send($admin->phone, $message); } 
                catch (\Exception $e) { \Illuminate\Support\Facades\Log::error($e->getMessage()); }
            }
        }
    }
}
