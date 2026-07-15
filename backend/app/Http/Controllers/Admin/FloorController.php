<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FloorController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $buildingId = $request->input('building_id');
        
        $floorsQuery = Floor::with('building');
        $buildingsQuery = Building::query();
        
        if ($user->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $floorsQuery->whereIn('building_id', $allowedBuildingIds);
                $buildingsQuery->whereIn('id', $allowedBuildingIds);
            }
        }

        if ($buildingId) {
            $floorsQuery->where('building_id', $buildingId);
        }

        return Inertia::render('Admin/Floor/Index', [
            'floors' => $floorsQuery->get(),
            'buildings' => $buildingsQuery->get(),
            'filters' => $request->only(['building_id'])
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,id'
        ]);

        if (auth()->user()->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null && !$allowedBuildingIds->contains($request->building_id)) {
                abort(403, 'Unauthorized building access.');
            }
        }

        Floor::create($request->all());
        return redirect()->back()->with('message', 'Lantai berhasil ditambahkan.');
    }

    public function update(Request $request, Floor $floor)
    {
        if (!auth()->user()->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,id'
        ]);

        if (auth()->user()->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null && !$allowedBuildingIds->contains($request->building_id)) {
                abort(403, 'Unauthorized building access.');
            }
            if ($allowedBuildingIds !== null && !$allowedBuildingIds->contains($floor->building_id)) {
                abort(403, 'Unauthorized building access.');
            }
        }

        $floor->update($request->all());
        return redirect()->back()->with('message', 'Lantai berhasil diubah.');
    }

    public function destroy(Floor $floor)
    {
        if (!auth()->user()->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        if (auth()->user()->hasRole('admin')) {
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null && !$allowedBuildingIds->contains($floor->building_id)) {
                abort(403, 'Unauthorized building access.');
            }
        }

        $floor->delete();
        return redirect()->back()->with('message', 'Lantai berhasil dihapus.');
    }
}
