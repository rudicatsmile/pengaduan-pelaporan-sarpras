<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Building;

class BuildingController extends Controller
{
    public function index()
    {
        $buildings = Building::orderBy('name')->get();
        return response()->json([
            'message' => 'Data gedung berhasil diambil',
            'data' => $buildings
        ]);
    }
}
