<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Room;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $roleAdmin = Role::create(['name' => 'admin']);
        $rolePetugas = Role::create(['name' => 'petugas']);
        $roleUser = Role::create(['name' => 'pengguna']);

        // 2. Admin User
        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole($roleAdmin);

        // 3. Categories
        Category::create(['name' => 'Infrastruktur']);
        Category::create(['name' => 'Kebersihan']);
        Category::create(['name' => 'Keamanan']);
        Category::create(['name' => 'Lainnya']);

        // 4. Rooms (QR Codes)
        Room::create(['code' => 'R-001', 'name' => 'Ruang Rapat A', 'building' => 'Gedung Utama', 'floor' => 1]);
        Room::create(['code' => 'R-002', 'name' => 'Laboratorium Komputer', 'building' => 'Gedung B', 'floor' => 2]);
        Room::create(['code' => 'R-003', 'name' => 'Toilet Lantai 1', 'building' => 'Gedung Utama', 'floor' => 1]);
    }
}
