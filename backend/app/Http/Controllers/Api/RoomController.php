<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show($code)
    {
        $room = Room::where('code', $code)->first();

        if (!$room) {
            return response()->json(['message' => 'Ruangan tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $room
        ]);
    }
}
