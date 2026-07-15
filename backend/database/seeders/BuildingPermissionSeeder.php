<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Building;
use Spatie\Permission\Models\Permission;

class BuildingPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $buildings = Building::all();
        foreach ($buildings as $building) {
            Permission::firstOrCreate([
                'name' => 'manage-building-' . $building->id,
                'guard_name' => 'web'
            ]);
        }
    }
}
