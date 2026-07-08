<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with('latestInspection')->orderBy('name')->get()->map(function ($room) {
            $lastInspection = $room->latestInspection;
            $room->last_inspection_at = $lastInspection ? $lastInspection->created_at->toDateTimeString() : null;
            
            $isOverdue = false;
            if ($room->room_type === 'toilet') {
                if (!$lastInspection) {
                    $isOverdue = true;
                } else {
                    $isOverdue = now()->diffInHours($lastInspection->created_at) >= 3;
                }
            }
            $room->is_overdue = $isOverdue;
            return $room;
        });

        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }

    public function getByFloor($floorId)
    {
        $rooms = Room::where('floor_id', $floorId)->with('latestInspection')->orderBy('name')->get()->map(function ($room) {
            $lastInspection = $room->latestInspection;
            $room->last_inspection_at = $lastInspection ? $lastInspection->created_at->toDateTimeString() : null;
            
            $isOverdue = false;
            if ($room->room_type === 'toilet') {
                if (!$lastInspection) {
                    $isOverdue = true;
                } else {
                    $isOverdue = now()->diffInHours($lastInspection->created_at) >= 3;
                }
            }
            $room->is_overdue = $isOverdue;
            return $room;
        });

        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }

    public function show($code)
    {
        if (str_starts_with($code, 'ROOM:')) {
            $id = str_replace('ROOM:', '', $code);
            $room = Room::with(['floor.building', 'latestInspection'])->find($id);
        } else {
            $room = Room::with(['floor.building', 'latestInspection'])->where('code', $code)->first();
        }

        if (!$room) {
            return response()->json(['message' => 'Ruangan tidak ditemukan'], 404);
        }

        $lastInspection = $room->latestInspection;
        $room->last_inspection_at = $lastInspection ? $lastInspection->created_at->toDateTimeString() : null;
        
        $isOverdue = false;
        if ($room->room_type === 'toilet') {
            if (!$lastInspection) {
                $isOverdue = true;
            } else {
                $isOverdue = now()->diffInHours($lastInspection->created_at) >= 3;
            }
        }
        $room->is_overdue = $isOverdue;

        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $room
        ]);
    }
}
