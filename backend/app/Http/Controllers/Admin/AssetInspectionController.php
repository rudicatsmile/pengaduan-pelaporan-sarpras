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
    use \App\Traits\BuildingAccess;

    public function index()
    {
        $user = auth()->user();
        $query = AssetInspection::with(['user', 'room.floor.building'])->latest();

        if ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->whereHas('room.floor', function($q) use ($allowedBuildingIds) {
                    $q->whereIn('building_id', $allowedBuildingIds);
                });
            }
        } else {
            $query->where('user_id', $user->id);
        }

        if (request()->filled('start_date') || request()->filled('end_date')) {
            $startDate = request()->filled('start_date') 
                ? \Carbon\Carbon::parse(request('start_date'), 'Asia/Jakarta')->startOfDay()->utc() 
                : null;
                
            $endDate = request()->filled('end_date') 
                ? \Carbon\Carbon::parse(request('end_date'), 'Asia/Jakarta')->endOfDay()->utc() 
                : null;

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } elseif ($startDate) {
                $singleDayEnd = \Carbon\Carbon::parse(request('start_date'), 'Asia/Jakarta')->endOfDay()->utc();
                $query->whereBetween('created_at', [$startDate, $singleDayEnd]);
            } elseif ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }
        }

        $inspections = $query->paginate(request('per_page', 10))->withQueryString();
        return Inertia::render('Admin/AssetInspection/Index', [
            'inspections' => $inspections,
            'filters' => request()->only(['per_page', 'start_date', 'end_date']),
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $buildingsQuery = Building::with(['floors.rooms']);
        
        if ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingsQuery->whereIn('id', $allowedBuildingIds);
            }
        }

        $buildings = $buildingsQuery->get();
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
        
        $user = auth()->user();
        
        // Ownership check
        if ($inspection->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            abort(403, 'Unauthorized');
        }

        // Building check
        if ($user->hasAnyRole(['admin', 'super_admin', 'supervisor'])) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $inspection->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    abort(403, 'Unauthorized (Building not assigned)');
                }
            }
        }
        return Inertia::render('Admin/AssetInspection/Show', [
            'inspection' => $inspection
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user->hasRole('super_admin')) {
            abort(403, 'Unauthorized');
        }

        $inspection = AssetInspection::with('details')->findOrFail($id);

        if ($inspection->details) {
            $inspection->details()->delete();
        }

        $inspection->delete();

        return redirect()->back()->with('success', 'Inspeksi aset berhasil dihapus.');
    }
}

