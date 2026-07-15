<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inspection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InspectionController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Inspection::with(['user', 'room.floor.building'])->latest();

        $allowedBuildingIds = null;
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

        if ($request->filled('building_id')) {
            $query->whereHas('room.floor', function($q) use ($request) {
                $q->where('building_id', $request->building_id);
            });
        }

        if ($request->filled('job_category_id')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('job_category_id', $request->job_category_id);
            });
        }

        $buildingsQuery = \App\Models\Building::query();
        if ($user->hasAnyRole(['admin', 'supervisor']) && $allowedBuildingIds !== null) {
            $buildingsQuery->whereIn('id', $allowedBuildingIds);
        }
        $buildings = $buildingsQuery->get(['id', 'name']);
        
        $jobCategories = \App\Models\JobCategory::all();

        return Inertia::render('Admin/Inspection/Index', [
            'inspections' => $query->get(),
            'buildings' => $buildings,
            'jobCategories' => $jobCategories,
            'filters' => request()->only(['building_id', 'job_category_id']),
        ]);
    }

    public function show($id)
    {
        $inspection = Inspection::with(['user', 'room.floor.building', 'images'])->findOrFail($id);
        
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

        if (!$inspection->is_read && $user->hasAnyRole(['super_admin', 'admin', 'supervisor'])) {
            $inspection->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Inspection/Show', [
            'inspection' => $inspection
        ]);
    }

    public function updateNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string'
        ]);

        $inspection = Inspection::findOrFail($id);
        
        $user = auth()->user();
        if (!$user->hasAnyRole(['super_admin', 'admin'])) {
            abort(403, 'Unauthorized');
        }

        $inspection->update(['notes' => $request->notes]);

        return redirect()->back()->with('success', 'Catatan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user->hasRole('super_admin')) {
            abort(403, 'Unauthorized');
        }

        $inspection = Inspection::with('images')->findOrFail($id);

        // Delete physical images if any
        if ($inspection->images) {
            foreach ($inspection->images as $image) {
                // Handle potential '/storage/' prefix in path
                $path = str_replace('/storage/', '', $image->image_path);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
            $inspection->images()->delete();
        }

        $inspection->delete();

        return redirect()->back()->with('success', 'Laporan inspeksi berhasil dihapus.');
    }
}
