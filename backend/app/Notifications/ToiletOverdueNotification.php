<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Room;
use App\Services\WablasService;

class ToiletOverdueNotification extends Notification
{
    use Queueable;

    protected $room;
    protected $lastInspectionTime;

    public function __construct(Room $room, $lastInspectionTime = null)
    {
        $this->room = $room;
        $this->lastInspectionTime = $lastInspectionTime;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        // Send WhatsApp message to the assigned user (notifiable)
        $this->sendWhatsApp($notifiable);

        return [
            'room_id' => $this->room->id,
            'room_name' => $this->room->name,
            'last_inspection_at' => $this->lastInspectionTime,
            'message' => "Ruang Toilet {$this->room->name} belum diinspeksi dalam 3 jam terakhir.",
        ];
    }

    protected function sendWhatsApp($notifiable)
    {
        if (!empty($notifiable->phone)) {
            $lastTimeFormatted = $this->lastInspectionTime 
                ? date('d M Y H:i', strtotime($this->lastInspectionTime)) 
                : 'Belum pernah';

            $msg = "Halo *{$notifiable->name}*,\n\n"
                 . "⚠️ *PERINGATAN INSPEKSI TOILET* ⚠️\n\n"
                 . "Ruang Toilet: *{$this->room->name}*\n"
                 . "Inspeksi Terakhir: *{$lastTimeFormatted}*\n\n"
                 . "Toilet ini belum diinspeksi dalam *3 jam* terakhir. Mohon segera melakukan inspeksi aset melalui aplikasi SiGAP.\n\n"
                 . "Terima kasih,\n"
                 . "*Sistem SiGAP*";

            WablasService::send($notifiable->phone, $msg);
        }
    }
}
