<?php

namespace App\Observers;

use App\Models\Building;

use Spatie\Permission\Models\Permission;

class BuildingObserver
{
    /**
     * Handle the Building "created" event.
     */
    public function created(Building $building): void
    {
        Permission::firstOrCreate(['name' => 'manage-building-' . $building->id, 'guard_name' => 'web']);
    }

    /**
     * Handle the Building "updated" event.
     */
    public function updated(Building $building): void
    {
        // Permission name is based on ID, so no change needed on name updates
    }

    /**
     * Handle the Building "deleted" event.
     */
    public function deleted(Building $building): void
    {
        Permission::where('name', 'manage-building-' . $building->id)->delete();
    }

    /**
     * Handle the Building "restored" event.
     */
    public function restored(Building $building): void
    {
        Permission::firstOrCreate(['name' => 'manage-building-' . $building->id, 'guard_name' => 'web']);
    }

    /**
     * Handle the Building "force deleted" event.
     */
    public function forceDeleted(Building $building): void
    {
        Permission::where('name', 'manage-building-' . $building->id)->delete();
    }
}
