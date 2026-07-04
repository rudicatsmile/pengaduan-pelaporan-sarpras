<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use PDF; // From barryvdh/laravel-dompdf

class RoomController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Room/Index', [
            'rooms' => Room::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $room = Room::create($request->all());
        return redirect()->back()->with('message', 'Ruangan berhasil ditambahkan.');
    }

    public function update(Request $request, Room $room)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $room->update($request->all());
        return redirect()->back()->with('message', 'Ruangan berhasil diubah.');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->back()->with('message', 'Ruangan berhasil dihapus.');
    }

    public function generateQr(Room $room)
    {
        // Generate public URL for this room
        $qrData = url('/p/' . $room->id);
        
        // Generate QR code image as base64 string
        $qrCode = base64_encode(QrCode::format('svg')->size(300)->generate($qrData));

        // Use PDF to render it beautifully
        $pdf = PDF::loadView('pdf.room_qr', ['room' => $room, 'qrCode' => $qrCode]);
        
        return $pdf->download('QR_Ruangan_' . $room->name . '.pdf');
    }
}
