<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FloorController extends Controller
{
    public function index(Request $request)
    {
        $buildingId = $request->input('building_id');
        
        $floorsQuery = Floor::with('building');
        
        if ($buildingId) {
            $floorsQuery->where('building_id', $buildingId);
        }

        return Inertia::render('Admin/Floor/Index', [
            'floors' => $floorsQuery->get(),
            'buildings' => Building::all(),
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

        $floor->update($request->all());
        return redirect()->back()->with('message', 'Lantai berhasil diubah.');
    }

    public function destroy(Floor $floor)
    {
        if (!auth()->user()->hasAnyRole(['admin', 'super_admin'])) {
            abort(403, 'Unauthorized action.');
        }

        $floor->delete();
        return redirect()->back()->with('message', 'Lantai berhasil dihapus.');
    }
}
