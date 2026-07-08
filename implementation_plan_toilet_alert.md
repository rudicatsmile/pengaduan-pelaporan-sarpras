# Rencana Implementasi: Jadwal Inspeksi Toilet 3-Jam Sekali & Notifikasi Otomatis

Membuat fitur dimana ruang toilet wajib diinspeksi asetnya setiap 3 jam sekali selama jam operasional (07:00 - 17:00). Jika terlewat, sistem akan mengirimkan notifikasi via WhatsApp (Wablas) ke petugas penanggung jawab yang ditunjuk, serta mencatatnya sebagai notifikasi di database.

## User Review Required

> [!IMPORTANT]
> 1. Kolom `room_type` baru ditambahkan pada tabel `rooms` dengan tipe data `enum('general', 'toilet')` untuk klasifikasi ruangan.
> 2. Penugasan petugas menggunakan tabel pivot baru `room_assignments` agar satu toilet bisa diawasi oleh beberapa petugas jika diperlukan.
> 3. Notifikasi WhatsApp akan dikirimkan otomatis menggunakan gateway Wablas yang dikonfigurasi melalui `.env` server.
> 4. Dokumentasi teknis konfigurasi cPanel (Cron Job) dan VPS (Systemd / Cron) akan dibuat dalam file [README_INSPEKSI_TOILET.md](file:///d:/Softwares/projects/web/pengaduan-pelaporan/README_INSPEKSI_TOILET.md).

## Proposed Changes

### Database & Migrations

#### [NEW] [2026_07_07_150000_add_room_type_and_assignments.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/database/migrations/2026_07_07_150000_add_room_type_and_assignments.php)
- Menambahkan kolom `room_type` (`general`, `toilet`) ke tabel `rooms`.
- Membuat tabel pivot `room_assignments` (`room_id`, `user_id`).

### Models

#### [MODIFY] [Room.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/app/Models/Room.php)
- Menambahkan relasi `assignedUsers()` (BelongsToMany ke User).
- Menambahkan relasi `inspections()` (HasMany ke AssetInspection).
- Menambahkan method/helper untuk mendapatkan status inspeksi terakhir.

#### [NEW] [RoomAssignment.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/app/Models/RoomAssignment.php)
- Model pivot untuk penugasan petugas ke ruangan.

### Logic & Scheduler

#### [NEW] [ToiletOverdueNotification.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/app/Notifications/ToiletOverdueNotification.php)
- Notification class yang menangani pengiriman database log dan WhatsApp via `WablasService`.

#### [NEW] [CheckToiletInspections.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/app/Console/Commands/CheckToiletInspections.php)
- Artisan Command `app:check-toilet-inspections` yang mengecek status toilet setiap 30 menit.
- Mencari toilet yang belum diinspeksi dalam 3 jam terakhir selama jam operasional (07:00 - 17:00).

#### [MODIFY] [console.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/routes/console.php)
- Mendaftarkan Artisan Command `app:check-toilet-inspections` agar dieksekusi secara otomatis oleh scheduler.

### API & Frontend Expose

#### [MODIFY] [RoomController.php](file:///d:/Softwares/projects/web/pengaduan-pelaporan/backend/app/Http/Controllers/Api/RoomController.php)
- Menyertakan informasi `last_inspection` dan `is_overdue` pada respons JSON agar Flutter dapat menampilkannya secara visual.

### Documentation

#### [NEW] [README_INSPEKSI_TOILET.md](file:///d:/Softwares/projects/web/pengaduan-pelaporan/README_INSPEKSI_TOILET.md)
- Catatan penting alur fitur, detail sistem database, dan panduan lengkap setup Cron Job scheduler pada cPanel dan VPS.

## Verification Plan

### Automated Tests / Commands
- Menjalankan migrasi database:
  `php artisan migrate`
- Menjalankan command secara manual untuk memvalidasi logikanya:
  `php artisan app:check-toilet-inspections`

### Manual Verification
- Melakukan verifikasi dengan cara memasukkan data ruangan toilet dummy, menetapkan penanggung jawab, lalu membiarkan data kosong lebih dari 3 jam (atau memanipulasi kolom `created_at` di DB), lalu menjalankan command scheduler untuk melihat apakah notifikasi WhatsApp (Wablas log) dan database notification berhasil terkirim.
