<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Building;

class BuildingController extends Controller
{
    use \App\Traits\BuildingAccess;

    public function index()
    {
        $query = Building::orderBy('name');
        
        $user = auth('sanctum')->user();
        if ($user && clone $user && clone $user && $user->hasRole('admin')) {
            // Need to set Auth user manually so trait works if we rely on Auth::user()
            \Illuminate\Support\Facades\Auth::setUser($user);
            
            $allowedBuildingIds = $this->getAllowedBuildingIds();
            if ($allowedBuildingIds !== null) {
                $query->whereIn('id', $allowedBuildingIds);
            }
        }

        $buildings = $query->get();
        return response()->json([
            'message' => 'Data gedung berhasil diambil',
            'data' => $buildings
        ]);
    }
}
