<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Room;
use App\Models\AssetInspection;
use App\Notifications\ToiletOverdueNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckToiletInspections extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-toilet-inspections';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Periksa ruangan toilet yang belum diinspeksi dalam 3 jam terakhir selama jam operasional (07:00 - 17:00)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info("Running CheckToiletInspections command...");

        // Ambil semua toilet
        $toilets = Room::where('room_type', 'toilet')
            ->with('assignedUsers')
            ->get();

        if ($toilets->isEmpty()) {
            $this->info("Tidak ada ruangan dengan tipe toilet.");
            return;
        }

        foreach ($toilets as $toilet) {
            // Ambil inspeksi aset terakhir untuk toilet ini
            $latestInspection = AssetInspection::where('room_id', $toilet->id)
                ->latest()
                ->first();

            $isOverdue = false;
            $lastInspectionTime = null;

            if (!$latestInspection) {
                // Jika belum pernah diinspeksi sama sekali, anggap overdue
                $isOverdue = true;
            } else {
                $lastInspectionTime = $latestInspection->created_at;
                // Cek jika selisih waktu sudah >= interval yang di-set (jam)
                if (now()->diffInHours($lastInspectionTime) >= $toilet->inspection_interval) {
                    $isOverdue = true;
                }
            }

            if ($isOverdue) {
                // Rate limiting: pastikan notifikasi untuk toilet ini belum dikirim dalam interval waktu tersebut
                $alreadyNotified = DB::table('notifications')
                    ->where('type', ToiletOverdueNotification::class)
                    ->where('data', 'like', '%"room_id":' . $toilet->id . ',%')
                    ->where('created_at', '>=', now()->subHours($toilet->inspection_interval))
                    ->exists();

                if ($alreadyNotified) {
                    $this->info("Toilet {$toilet->name} overdue, tetapi notifikasi sudah dikirim baru-baru ini. Skip.");
                    continue;
                }

                $assignedOfficers = $toilet->assignedUsers;

                if ($assignedOfficers->isEmpty()) {
                    $this->warn("Toilet {$toilet->name} overdue, tetapi tidak ada petugas yang ditugaskan.");
                    continue;
                }

                foreach ($assignedOfficers as $officer) {
                    try {
                        $officer->notify(new ToiletOverdueNotification($toilet, $lastInspectionTime));
                        $this->info("Notifikasi dikirim ke petugas {$officer->name} untuk toilet {$toilet->name}.");
                    } catch (\Exception $e) {
                        Log::error("Gagal mengirim notifikasi ke {$officer->name}: " . $e->getMessage());
                    }
                }
            } else {
                $this->info("Toilet {$toilet->name} dalam kondisi aman (terakhir diinspeksi: {$lastInspectionTime}).");
            }
        }

        Log::info("CheckToiletInspections command finished.");
    }
}
