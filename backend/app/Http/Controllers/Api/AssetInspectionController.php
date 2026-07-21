<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AssetInspection;
use App\Models\AssetInspectionDetail;
use App\Models\AssetSimbada;
use App\Models\Room;
use Illuminate\Support\Facades\DB;

class AssetInspectionController extends Controller
{
    use \App\Traits\BuildingAccess;
    use \App\Traits\NotifyAdmins;

    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = AssetInspection::with(['user', 'room.floor.building'])->latest();

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->whereHas('room.floor', function($q) use ($allowedBuildingIds) {
                    $q->whereIn('building_id', $allowedBuildingIds);
                });
            }
        } elseif ($user->hasAnyRole(['super_admin', 'supervisor'])) {
            // Can see all
        } else {
            // Only see own inspections
            $query->where('user_id', $user->id);
        }

        if ($request->filled('start_date') || $request->filled('end_date')) {
            $startDate = $request->filled('start_date') 
                ? \Carbon\Carbon::parse($request->start_date, 'Asia/Jakarta')->startOfDay()->utc() 
                : null;
                
            $endDate = $request->filled('end_date') 
                ? \Carbon\Carbon::parse($request->end_date, 'Asia/Jakarta')->endOfDay()->utc() 
                : null;

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } elseif ($startDate) {
                $singleDayEnd = \Carbon\Carbon::parse($request->start_date, 'Asia/Jakarta')->endOfDay()->utc();
                $query->whereBetween('created_at', [$startDate, $singleDayEnd]);
            } elseif ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(10)
        ]);
    }

    public function getAssets(Request $request)
    {
        $roomId = $request->input('room_id');
        $room = Room::findOrFail($roomId);
        
        $kdUpb = $room->Kd_UPB;
        $kdRuang = $room->code;
        
        if (!$kdUpb || !$kdRuang) {
            return response()->json([
                'success' => false,
                'data' => []
            ]);
        }
        
        try {
            $assets = AssetSimbada::where('Kd_UPB', $kdUpb)
                ->where('Kd_Ruang', $kdRuang)
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $assets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'notes' => 'nullable|string',
            'assets' => 'required|array',
            'assets.*.asset_id' => 'required',
            'assets.*.asset_name' => 'required',
            'assets.*.is_present' => 'required|boolean',
            'assets.*.condition' => 'nullable|string',
            'assets.*.notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $inspection = AssetInspection::create([
                'user_id' => $request->user()->id,
                'room_id' => $validated['room_id'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['assets'] as $asset) {
                AssetInspectionDetail::create([
                    'asset_inspection_id' => $inspection->id,
                    'asset_id' => $asset['asset_id'],
                    'asset_name' => $asset['asset_name'],
                    'is_present' => $asset['is_present'],
                    'condition' => $asset['is_present'] ? ($asset['condition'] ?? 'baik') : 'baik',
                    'notes' => $asset['notes'] ?? null,
                ]);
            }

            DB::commit();

            try {
                $this->notifyAssetInspection($inspection);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to notify admins: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Inspeksi aset berhasil disimpan',
                'data' => $inspection
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan inspeksi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $inspection = AssetInspection::with(['user', 'room.floor.building', 'details'])->findOrFail($id);

        if (!$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            if ($inspection->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
        }

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $inspection->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $inspection
        ]);
    }
}
