<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Building;
use Spatie\Permission\Models\Permission;

class AdminBuildingController extends Controller
{
    public function getAssignedBuildings($userId)
    {
        $user = User::findOrFail($userId);
        
        if ($user->hasRole('super_admin')) {
            return response()->json([
                'success' => true,
                'data' => Building::all(),
                'is_super_admin' => true,
            ]);
        }

        $permissions = $user->getAllPermissions()->pluck('name');
        
        $buildingIds = collect($permissions)->filter(function ($name) {
            return str_starts_with($name, 'manage-building-');
        })->map(function ($name) {
            return str_replace('manage-building-', '', $name);
        })->values();

        $buildings = Building::whereIn('id', $buildingIds)->get();

        return response()->json([
            'success' => true,
            'data' => $buildings,
            'is_super_admin' => false,
        ]);
    }

    public function assignBuilding(Request $request, $userId)
    {
        $request->validate([
            'building_id' => 'required|exists:buildings,id'
        ]);

        $user = User::findOrFail($userId);
        $permissionName = 'manage-building-' . $request->building_id;

        // Ensure permission exists
        Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);

        $user->givePermissionTo($permissionName);

        return response()->json([
            'success' => true,
            'message' => 'Building assigned successfully'
        ]);
    }

    public function revokeBuilding(Request $request, $userId)
    {
        $request->validate([
            'building_id' => 'required|exists:buildings,id'
        ]);

        $user = User::findOrFail($userId);
        $permissionName = 'manage-building-' . $request->building_id;

        if ($user->hasPermissionTo($permissionName)) {
            $user->revokePermissionTo($permissionName);
        }

        return response()->json([
            'success' => true,
            'message' => 'Building revoked successfully'
        ]);
    }
}
