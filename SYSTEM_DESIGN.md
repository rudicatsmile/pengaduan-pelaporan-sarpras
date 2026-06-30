# System Design Document
**Proyek:** Sistem Pengaduan dan Pelaporan Online Berbasis QR Code
**Referensi:** PRD v1.0

---

## 1. Arsitektur Sistem & Tech Stack

Berdasarkan hasil diskusi, arsitektur yang akan digunakan adalah:

- **Frontend Mobile (Pengguna & Petugas):** Flutter dengan **GetX** untuk State Management & Routing.
- **Frontend Web (Admin Dashboard):** React JS terintegrasi dengan **Laravel Inertia.js** (Monolith modern).
- **Backend API:** Laravel 11.x
- **Database:** MySQL 8.x
- **Authentication API:** Laravel Sanctum (Token-based untuk Mobile).
- **Role-Based Access Control (RBAC):** `spatie/laravel-permission`
- **File Storage:** S3 Compatible (MinIO / AWS S3) untuk upload foto pengaduan dan bukti penyelesaian.

---

## 2. Database Schema (MySQL)

Skema database dirancang agar efisien dengan menggabungkan entitas pengaduan dan pelaporan dalam satu tabel utama (`reports`).

### `users`
Menyimpan data otentikasi semua aktor (Pengguna, Admin, Petugas).
- `id` (BIGINT, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR)
- `phone` (VARCHAR, Nullable)
- `created_at`, `updated_at`

*(Tabel `roles`, `permissions`, `model_has_roles`, dll digenerate otomatis oleh Spatie)*

### `rooms`
Menyimpan data ruangan untuk fitur QR Code.
- `id` (BIGINT, PK)
- `code` (VARCHAR, Unique) -> String yang di-generate untuk QR Code
- `name` (VARCHAR) -> Contoh: "Ruang Rapat A"
- `building` (VARCHAR)
- `floor` (INT)
- `created_at`, `updated_at`

### `categories`
Kategori masalah (Infrastruktur, Kebersihan, Keamanan, dll).
- `id` (BIGINT, PK)
- `name` (VARCHAR)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at`

### `reports`
Tabel utama (Gabungan Pengaduan QR dan Pelaporan Umum).
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK to `users`) -> Pelapor
- `type` (ENUM: 'pengaduan_qr', 'pelaporan_umum')
- `room_id` (BIGINT, Nullable, FK to `rooms`) -> Terisi jika type = pengaduan_qr
- `location_text` (VARCHAR, Nullable) -> Terisi jika type = pelaporan_umum
- `category_id` (BIGINT, FK to `categories`)
- `description` (TEXT)
- `status` (ENUM: 'baru', 'diverifikasi', 'didelegasikan', 'dalam_proses', 'selesai')
- `assigned_to` (BIGINT, Nullable, FK to `users`) -> Petugas yang ditugaskan
- `verified_by` (BIGINT, Nullable, FK to `users`) -> Admin yang memverifikasi
- `verified_at` (TIMESTAMP, Nullable)
- `resolved_at` (TIMESTAMP, Nullable)
- `created_at`, `updated_at`, `deleted_at`

### `report_attachments`
Menyimpan multi-foto, baik dari pelapor maupun petugas.
- `id` (BIGINT, PK)
- `report_id` (BIGINT, FK to `reports`)
- `file_path` (VARCHAR) -> URL/Path MinIO
- `type` (ENUM: 'issue', 'resolution') -> 'issue' (foto pelapor), 'resolution' (bukti selesai dari petugas)
- `created_at`

### `report_activities`
History log (Audit trail) untuk perubahan status.
- `id` (BIGINT, PK)
- `report_id` (BIGINT, FK to `reports`)
- `user_id` (BIGINT, FK to `users`) -> Aktor yang melakukan aksi
- `action` (VARCHAR) -> Contoh: "Status diubah menjadi Diverifikasi"
- `note` (TEXT, Nullable)
- `created_at`

---

## 3. API Endpoint List (Laravel)

Prefix URL: `/api/v1`

### Authentication & Profile
- `POST /login` : Login user (mengembalikan Sanctum Token & Role).
- `POST /register` : Registrasi pengguna baru.
- `POST /logout` : Logout & revoke token (Membutuhkan Bearer Token).
- `GET /user` : Mendapatkan profil user yang sedang login.

### Master Data
- `GET /categories` : List kategori aktif.
- `GET /rooms/{code}` : Validasi & ambil detail ruangan berdasarkan scan QR.

### Reports (Pengguna Umum)
- `GET /reports` : List riwayat pengaduan/pelaporan milik sendiri (dengan pagination & filter).
- `POST /reports` : Submit laporan baru (Mendukung `multipart/form-data` untuk upload `attachments[]`).
- `GET /reports/{id}` : Detail laporan beserta riwayat aktivitas.

### Tasks (Khusus Petugas)
- `GET /tasks` : List pengaduan yang berstatus 'didelegasikan'/'dalam_proses' ke petugas yang login.
- `POST /tasks/{id}/process` : Petugas memulai pengerjaan (ubah status ke 'dalam_proses').
- `POST /tasks/{id}/resolve` : Petugas menyelesaikan tugas, upload `attachments[]` (bukti selesai), dan isi `note`.

---

## 4. Flutter UI/UX Flow

Flow aplikasi disusun berbasis **Bottom Navigation Bar** menggunakan arsitektur routing GetX.

### 4.1. Alur Otentikasi (Onboarding)
1. **Splash Screen** -> Cek validitas Sanctum token di Local Storage.
2. Jika tidak ada token -> **Login Screen** (Ada opsi "Daftar di sini").
3. **Register Screen** -> Input Nama, Email, Password, No HP -> Submit.

### 4.2. Main Navigation (Bottom Nav)
Terdiri dari 3 Tab utama:
- **Tab 1: Home**
  - Header dengan ucapan sapaan & Nama User.
  - 2 Tombol Aksi Utama (Mencolok / Floating style):
    - 📷 **Scan QR Ruangan (Pengaduan)**
    - 📝 **Buat Laporan Umum**
  - Section "Laporan Terkini" (Preview 3 laporan terakhir milik user).
- **Tab 2: Riwayat (History)**
  - List semua laporan.
  - Tab Bar Filter (Semua, Proses, Selesai).
  - Tiap item list menampilkan: Judul, Tanggal, dan Badge Status warna-warni (Abu=Baru, Biru=Diverifikasi, Kuning=Proses, Hijau=Selesai).
- **Tab 3: Profil**
  - Data diri, Ubah Password, Bantuan, Logout.

### 4.3. Flow Pembuatan Pengaduan (QR)
1. User tap "Scan QR".
2. **Camera View Screen** terbuka -> Arahkan ke QR Code.
3. API `/rooms/{code}` dipanggil -> Jika valid, pindah ke **Form Pengaduan Screen**.
4. Di Form Pengaduan:
   - Lokasi Ruangan otomatis terkunci (read-only) berdasarkan hasil scan.
   - User pilih Kategori (Dropdown).
   - User isi Deskripsi.
   - User tap ikon kamera/galeri untuk upload foto (Bisa >1 foto).
5. Tap Submit -> Tampil Loading / Overlay -> Berhasil! Redirect ke Tab Riwayat.

### 4.4. Flow Pembuatan Laporan (Umum)
1. User tap "Buat Laporan Umum".
2. Masuk ke **Form Laporan Screen**.
3. Input Kategori, Deskripsi, Upload Foto.
4. Terdapat field tambahan: **Lokasi** (Bisa ketik manual atau ambil koordinat GPS dengan package `geolocator`).
5. Tap Submit -> Berhasil!

### 4.5. Flow Petugas (Jika login sebagai Petugas)
Jika role = Petugas, UI Home akan berbeda.
1. **Home Petugas**: Menampilkan widget "Tugas Baru" dan "Tugas Sedang Dikerjakan".
2. **Task Detail Screen**: 
   - Tampil detail kerusakan & foto dari pelapor.
   - Tombol "Mulai Kerjakan" (Ubah status).
   - Setelah mulai, tombol berubah jadi "Selesaikan Tugas".
   - Jika ditekan -> Popup Form Upload Bukti Selesai (Foto) + Catatan -> Submit -> Selesai.
