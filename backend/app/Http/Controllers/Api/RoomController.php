<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('name')->get();
        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }

    public function getByFloor($floorId)
    {
        $rooms = Room::where('floor_id', $floorId)->orderBy('name')->get();
        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }

    public function show($code)
    {
        if (str_starts_with($code, 'ROOM:')) {
            $id = str_replace('ROOM:', '', $code);
            $room = Room::find($id);
        } else {
            $room = Room::where('code', $code)->first();
        }

        if (!$room) {
            return response()->json(['message' => 'Ruangan tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $room
        ]);
    }
}
