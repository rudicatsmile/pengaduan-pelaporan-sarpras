<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Category;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestReportController extends Controller
{
    public function showForm($roomId)
    {
        $room = Room::findOrFail($roomId);
        $categories = Category::all();

        return Inertia::render('Public/ReportForm', [
            'room' => $room,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request, $roomId)
    {
        $room = Room::findOrFail($roomId);

        $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:20',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB per image
        ]);

        $report = Report::create([
            'type' => 'pengaduan_qr',
            'room_id' => $room->id,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'guest_name' => $request->guest_name,
            'guest_phone' => $request->guest_phone,
            'status' => 'baru',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reports', 'public');
                $report->attachments()->create([
                    'file_path' => $path,
                ]);
            }
        }

        $report->activities()->create([
            'user_id' => null, // Guest
            'action' => 'Laporan dibuat oleh Pengunjung Anonim: ' . $request->guest_name,
        ]);

        return redirect()->back()->with([
            'success' => 'Terima kasih, laporan Anda telah kami terima dan akan segera ditindaklanjuti oleh petugas sarpras.',
            'report_id' => $report->id,
        ]);
    }
}
