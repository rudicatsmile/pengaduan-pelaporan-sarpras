<?php

namespace App\Traits;

use App\Models\Building;
use Illuminate\Support\Facades\Auth;

trait BuildingAccess
{
    /**
     * Get the building IDs that the currently authenticated user is allowed to manage.
     * Returns an array of IDs, or null if the user has access to all buildings (e.g. super_admin).
     *
     * @return \Illuminate\Support\Collection|null
     */
    public function getAllowedBuildingIds(): ?\Illuminate\Support\Collection
    {
        $user = Auth::user();
        if (!$user) {
            return collect(); // No access for guests
        }

        // Super admins have access to all buildings
        if ($user->hasRole('super_admin')) {
            return null;
        }

        $permissions = $user->getAllPermissions()->pluck('name');
        
        return collect($permissions)->filter(function ($name) {
            return str_starts_with($name, 'manage-building-');
        })->map(function ($name) {
            return (int) str_replace('manage-building-', '', $name);
        })->values();
    }
}
