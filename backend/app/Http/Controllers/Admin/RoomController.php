<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Building;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use PDF; // From barryvdh/laravel-dompdf

class RoomController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $buildingId = $request->input('building_id');
        $floorId = $request->input('floor_id');

        $roomsQuery = Room::with(['floor.building', 'assignedUsers']);
        $buildingsQuery = Building::with('floors');

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $roomsQuery->whereHas('floor', function($q) use ($allowedBuildingIds) {
                    $q->whereIn('building_id', $allowedBuildingIds);
                });
                $buildingsQuery->whereIn('id', $allowedBuildingIds);
            }
        }

        if ($floorId) {
            $roomsQuery->where('floor_id', $floorId);
        } elseif ($buildingId) {
            $roomsQuery->whereHas('floor', function ($q) use ($buildingId) {
                $q->where('building_id', $buildingId);
            });
        }

        return Inertia::render('Admin/Room/Index', [
            'rooms' => $roomsQuery->get(),
            'buildings' => $buildingsQuery->get(),
            'officers' => User::role('petugas')->get(),
            'filters' => $request->only(['building_id', 'floor_id'])
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Unauthorized action. Hanya Super Admin yang dapat mengelola ruangan.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'floor_id' => 'required|exists:floors,id',
            'room_type' => 'required|in:general,toilet',
            'inspection_interval' => 'required_if:room_type,toilet|integer|min:1',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id',
        ]);
        
        $data = $request->all();
        if ($request->input('room_type') === 'general') {
            $data['inspection_interval'] = 3;
        }
        
        $room = Room::create($data);
        if ($request->input('room_type') === 'toilet') {
            $room->assignedUsers()->sync($request->input('assigned_users', []));
        } else {
            $room->assignedUsers()->sync([]);
        }
        return redirect()->back()->with('message', 'Ruangan berhasil ditambahkan.');
    }

    public function update(Request $request, Room $room)
    {
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Unauthorized action. Hanya Super Admin yang dapat mengelola ruangan.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'floor_id' => 'required|exists:floors,id',
            'room_type' => 'required|in:general,toilet',
            'inspection_interval' => 'required_if:room_type,toilet|integer|min:1',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id',
        ]);
        
        $data = $request->all();
        if ($request->input('room_type') === 'general') {
            $data['inspection_interval'] = 3;
        }
        
        $room->update($data);
        if ($request->input('room_type') === 'toilet') {
            $room->assignedUsers()->sync($request->input('assigned_users', []));
        } else {
            $room->assignedUsers()->sync([]);
        }
        return redirect()->back()->with('message', 'Ruangan berhasil diubah.');
    }

    public function destroy(Room $room)
    {
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Unauthorized action. Hanya Super Admin yang dapat mengelola ruangan.');
        }
        $room->delete();
        return redirect()->back()->with('message', 'Ruangan berhasil dihapus.');
    }

    public function generateQr(Room $room)
    {
        // Generate public URL for this room
        $qrData = url('/p/' . $room->id);
        
        // Generate QR code image as base64 string
        $qrCode = base64_encode(QrCode::format('svg')->size(300)->generate($qrData));

        // Get application name from settings
        $appName = \App\Models\Setting::where('key', 'app_name')->value('value') ?? 'Pengaduan Sarpras';

        // Use PDF to render it beautifully
        $pdf = PDF::loadView('pdf.room_qr', [
            'room' => $room,
            'qrCode' => $qrCode,
            'appName' => $appName
        ]);
        
        return $pdf->download('QR_Ruangan_' . $room->name . '.pdf');
    }
}
