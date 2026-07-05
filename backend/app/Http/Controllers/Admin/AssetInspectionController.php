<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AssetInspection;
use App\Models\AssetInspectionDetail;
use App\Models\AssetSimbada;
use App\Models\Building;
use App\Models\Room;
use Illuminate\Support\Facades\DB;

class AssetInspectionController extends Controller
{
    public function index()
    {
        $inspections = AssetInspection::with(['user', 'room.floor.building'])->latest()->get();
        return Inertia::render('Admin/AssetInspection/Index', [
            'inspections' => $inspections
        ]);
    }

    public function create()
    {
        $buildings = Building::with(['floors.rooms'])->get();
        return Inertia::render('Admin/AssetInspection/Create', [
            'buildings' => $buildings
        ]);
    }

    public function getAssets(Request $request)
    {
        $roomId = $request->input('room_id');
        $room = Room::findOrFail($roomId);
        
        $kdUpb = $room->Kd_UPB;
        $kdRuang = $room->code;
        
        if (!$kdUpb || !$kdRuang) {
            return response()->json([]);
        }
        
        try {
            $assets = AssetSimbada::where('Kd_UPB', $kdUpb)
                ->where('Kd_Ruang', $kdRuang)
                ->get();
                
            return response()->json($assets);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'notes' => 'nullable|string',
            'assets' => 'required|array',
            'assets.*.asset_id' => 'required|string',
            'assets.*.asset_name' => 'required|string',
            'assets.*.is_present' => 'required|boolean',
            'assets.*.condition' => 'required|in:baik,rusak',
            'assets.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $inspection = AssetInspection::create([
                'user_id' => auth()->id(),
                'room_id' => $validated['room_id'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['assets'] as $assetData) {
                AssetInspectionDetail::create([
                    'asset_inspection_id' => $inspection->id,
                    'asset_id' => $assetData['asset_id'],
                    'asset_name' => $assetData['asset_name'],
                    'is_present' => $assetData['is_present'],
                    'condition' => $assetData['condition'],
                    'notes' => $assetData['notes'] ?? null,
                ]);
            }

            DB::commit();
            return redirect()->route('asset-inspections.index')->with('success', 'Inspeksi aset berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan inspeksi aset: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $inspection = AssetInspection::with(['user', 'room.floor.building', 'details'])->findOrFail($id);
        
        return Inertia::render('Admin/AssetInspection/Show', [
            'inspection' => $inspection
        ]);
    }
}

