<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Room;
use App\Models\Report;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Setup Roles
        $roleAdmin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $rolePetugas = Role::firstOrCreate(['name' => 'petugas', 'guard_name' => 'web']);
        $roleUser = Role::firstOrCreate(['name' => 'pengguna', 'guard_name' => 'web']);

        // 2. Setup Dummy Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            ['name' => 'Super Admin', 'password' => Hash::make('password'), 'phone' => '0811111111']
        );
        $admin->assignRole($roleAdmin);

        $petugas1 = User::firstOrCreate(
            ['email' => 'petugas@petugas.com'],
            ['name' => 'Budi Teknisi', 'password' => Hash::make('password'), 'phone' => '0822222222']
        );
        $petugas1->assignRole($rolePetugas);
        
        $petugas2 = User::firstOrCreate(
            ['email' => 'petugas2@petugas.com'],
            ['name' => 'Anton IT', 'password' => Hash::make('password'), 'phone' => '0833333333']
        );
        $petugas2->assignRole($rolePetugas);

        $pengguna = User::firstOrCreate(
            ['email' => 'pengguna@pengguna.com'],
            ['name' => 'Joko Dosen', 'password' => Hash::make('password'), 'phone' => '0844444444']
        );
        $pengguna->assignRole($roleUser);

        // 3. Setup Categories
        $katListrik = Category::firstOrCreate(['name' => 'Kelistrikan / Lampu']);
        $katAC = Category::firstOrCreate(['name' => 'Pendingin Ruangan (AC)']);
        $katBersih = Category::firstOrCreate(['name' => 'Kebersihan / Sanitasi']);
        $katInfrastruktur = Category::firstOrCreate(['name' => 'Infrastruktur (Meja/Pintu)']);
        $katIT = Category::firstOrCreate(['name' => 'IT / Proyektor / Internet']);

        // 4. Setup Rooms
        $ruang1 = Room::firstOrCreate(['name' => 'Ruang Kelas A-101'], ['code' => 'R-101', 'building' => 'Gedung A', 'floor' => 1]);
        $ruang2 = Room::firstOrCreate(['name' => 'Laboratorium Komputer 1'], ['code' => 'LAB-01', 'building' => 'Gedung B', 'floor' => 2]);
        $ruang3 = Room::firstOrCreate(['name' => 'Aula Utama'], ['code' => 'AULA', 'building' => 'Gedung Rektorat', 'floor' => 1]);
        $ruang4 = Room::firstOrCreate(['name' => 'Toilet Lantai 2'], ['code' => 'TLT-02', 'building' => 'Gedung B', 'floor' => 2]);

        // 5. Setup Dummy Reports
        
        // Report 1: Baru (Menunggu Verifikasi)
        $report1 = Report::create([
            'user_id' => $pengguna->id,
            'type' => 'pengaduan_qr',
            'room_id' => $ruang1->id,
            'category_id' => $katAC->id,
            'description' => 'AC di ruang kelas A-101 meneteskan air ke meja mahasiswa.',
            'status' => 'baru',
            'created_at' => Carbon::now()->subDays(2),
        ]);
        $report1->activities()->create(['user_id' => $pengguna->id, 'action' => 'Laporan dibuat', 'created_at' => Carbon::now()->subDays(2)]);
        
        // Report 2: Diverifikasi
        $report2 = Report::create([
            'user_id' => $pengguna->id,
            'type' => 'pengaduan_qr',
            'room_id' => $ruang2->id,
            'category_id' => $katIT->id,
            'description' => 'Proyektor mati total tidak bisa menyala.',
            'status' => 'diverifikasi',
            'verified_by' => $admin->id,
            'verified_at' => Carbon::now()->subDays(1),
            'created_at' => Carbon::now()->subDays(3),
        ]);
        $report2->activities()->create(['user_id' => $pengguna->id, 'action' => 'Laporan dibuat', 'created_at' => Carbon::now()->subDays(3)]);
        $report2->activities()->create(['user_id' => $admin->id, 'action' => 'Laporan diverifikasi', 'created_at' => Carbon::now()->subDays(1)]);

        // Report 3: Diproses
        $report3 = Report::create([
            'user_id' => $pengguna->id,
            'type' => 'pelaporan_umum',
            'location_text' => 'Parkiran Motor Depan',
            'category_id' => $katInfrastruktur->id,
            'description' => 'Pintu gerbang parkiran motor rodanya anjlok.',
            'status' => 'dalam_proses',
            'verified_by' => $admin->id,
            'verified_at' => Carbon::now()->subDays(2),
            'assigned_to' => $petugas1->id,
            'created_at' => Carbon::now()->subDays(4),
        ]);
        $report3->activities()->create(['user_id' => $pengguna->id, 'action' => 'Laporan dibuat', 'created_at' => Carbon::now()->subDays(4)]);
        $report3->activities()->create(['user_id' => $admin->id, 'action' => 'Laporan diverifikasi', 'created_at' => Carbon::now()->subDays(2)]);
        $report3->activities()->create(['user_id' => $admin->id, 'action' => 'Laporan didelegasikan ke ' . $petugas1->name, 'created_at' => Carbon::now()->subDays(1)]);
        $report3->activities()->create(['user_id' => $petugas1->id, 'action' => 'Petugas mulai memproses tugas', 'created_at' => Carbon::now()->subHours(5)]);

        // Report 4: Selesai
        $report4 = Report::create([
            'user_id' => $pengguna->id,
            'type' => 'pengaduan_qr',
            'room_id' => $ruang4->id,
            'category_id' => $katBersih->id,
            'description' => 'Wastafel mampet dan air menggenang.',
            'status' => 'selesai',
            'verified_by' => $admin->id,
            'verified_at' => Carbon::now()->subDays(5),
            'assigned_to' => $petugas2->id,
            'created_at' => Carbon::now()->subDays(6),
        ]);
        $report4->activities()->create(['user_id' => $pengguna->id, 'action' => 'Laporan dibuat', 'created_at' => Carbon::now()->subDays(6)]);
        $report4->activities()->create(['user_id' => $admin->id, 'action' => 'Laporan diverifikasi', 'created_at' => Carbon::now()->subDays(5)]);
        $report4->activities()->create(['user_id' => $admin->id, 'action' => 'Laporan didelegasikan ke ' . $petugas2->name, 'created_at' => Carbon::now()->subDays(4)]);
        $report4->activities()->create(['user_id' => $petugas2->id, 'action' => 'Petugas mulai memproses tugas', 'created_at' => Carbon::now()->subDays(3)]);
        $report4->activities()->create(['user_id' => $petugas2->id, 'action' => 'Petugas menyelesaikan tugas dengan catatan: Sudah dibersihkan sumbatannya', 'created_at' => Carbon::now()->subDays(2)]);

        // Generate data historis untuk Analitik (Bulan lalu)
        for ($i = 0; $i < 5; $i++) {
            Report::create([
                'user_id' => $pengguna->id,
                'type' => 'pelaporan_umum',
                'location_text' => 'Fasilitas Umum',
                'category_id' => $katListrik->id,
                'description' => 'Lampu mati ' . $i,
                'status' => 'selesai',
                'verified_by' => $admin->id,
                'assigned_to' => $petugas1->id,
                'created_at' => Carbon::now()->subMonths(1)->subDays($i),
            ]);
        }
    }
}
