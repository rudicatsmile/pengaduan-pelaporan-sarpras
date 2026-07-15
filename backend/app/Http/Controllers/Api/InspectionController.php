<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inspection;
use App\Models\InspectionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InspectionController extends Controller
{
    use \App\Traits\BuildingAccess;
    use \App\Traits\NotifyAdmins;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Inspection::with(['user', 'room', 'images'])->latest();

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->whereHas('room.floor', function($q) use ($allowedBuildingIds) {
                    $q->whereIn('building_id', $allowedBuildingIds);
                });
            }
        } elseif ($user->hasAnyRole(['super_admin', 'supervisor'])) {
            // Bisa melihat semuanya
        } else {
            // Hanya bisa melihat laporannya sendiri
            $query->where('user_id', $user->id);
        }

        if ($request->filled('building_id')) {
            $query->whereHas('room.floor', function($q) use ($request) {
                $q->where('building_id', $request->building_id);
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'description' => 'required|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        $inspection = Inspection::create([
            'user_id' => $request->user()->id,
            'room_id' => $request->room_id,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('inspections', 'public');
                InspectionImage::create([
                    'inspection_id' => $inspection->id,
                    'image_path' => '/storage/' . $path,
                ]);
            }
        }

        try {
            $this->notifyInspection($inspection);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to notify admins: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Laporan inspeksi berhasil dibuat.',
            'data' => $inspection->load('images')
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $inspection = Inspection::with(['user', 'room', 'images'])->findOrFail($id);
        $user = $request->user();

        if ($inspection->user_id !== $user->id && !$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $inspection->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $inspection
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $inspection = Inspection::findOrFail($id);
        $user = $request->user();

        if (!$user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $inspection->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        $inspection->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Status inspeksi berhasil diubah menjadi sudah dibaca.',
            'data' => $inspection
        ]);
    }

    public function updateNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string'
        ]);

        $inspection = Inspection::findOrFail($id);
        $user = $request->user();

        if (!$user->hasAnyRole(['super_admin', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $buildingId = $inspection->room?->floor?->building_id;
                if ($buildingId && !$allowedBuildingIds->contains($buildingId)) {
                    return response()->json(['message' => 'Unauthorized (Building not assigned)'], 403);
                }
            }
        }

        $inspection->update(['notes' => $request->notes]);

        return response()->json([
            'success' => true,
            'message' => 'Catatan berhasil diperbarui.',
            'data' => $inspection
        ]);
    }
}
