<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Floor;

class FloorController extends Controller
{
    public function getByBuilding($buildingId)
    {
        $floors = Floor::where('building_id', $buildingId)->orderBy('name')->get();
        return response()->json([
            'message' => 'Data lantai berhasil diambil',
            'data' => $floors
        ]);
    }
}
