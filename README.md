# Sistem Pelaporan Sarana & Prasarana 🏢

Sistem Pelaporan Sarana dan Prasarana adalah aplikasi berbasis *Full-Stack* (Web & Mobile) yang dirancang untuk mendigitalisasi proses pengaduan kerusakan fasilitas di sebuah gedung, kampus, atau institusi. 

Aplikasi ini menggunakan sistem **QR Code** untuk mempercepat identifikasi lokasi/ruangan dan terintegrasi dengan **WhatsApp Notifikasi (Wablas)** untuk memberikan informasi *real-time* kepada pihak pelapor maupun petugas lapangan.

---

## 🛠️ Tech Stack Utama
- **Backend**: Laravel 11.x, MySQL.
- **Web Frontend (Admin Dashboard)**: React.js, Inertia.js, Tailwind CSS.
- **Mobile App (User & Petugas)**: Flutter (GetX State Management, Dio HTTP Client).
- **Integrations**: Wablas API (WhatsApp Notifikasi).
- **Authentication**: Laravel Sanctum (Mobile) & Breeze/Session (Web).

---

## 🚀 Quick Start (Local Development)

Bagi developer yang ingin menjalankan aplikasi ini di komputer lokal, ikuti langkah-langkah di bawah ini:

### 1. Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- Flutter SDK (Versi >= 3.0)
- MySQL Server

### 2. Setup Backend & Web Panel (Laravel)
```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Instal dependensi PHP dan Node.js
composer install
npm install

# 3. Setup Environment File
cp .env.example .env
php artisan key:generate

# Buka file .env dan sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Jangan lupa isi WABLAS_API_DOMAIN dan WABLAS_API_TOKEN jika ingin test WhatsApp

# 4. Jalankan Migrasi & Seeder Database (Penting untuk Setup Role/Kategori Dummy)
php artisan migrate --seed

# 5. Buat Symlink untuk akses gambar (Local Storage)
php artisan storage:link

# 6. Jalankan Service Backend
npm run dev
php artisan serve
```
Web Admin dapat diakses pada `http://localhost:8000`.

### 3. Setup Mobile App (Flutter)
```bash
# 1. Masuk ke direktori mobile
cd mobile

# 2. Instal package Flutter
flutter pub get

# 3. Konfigurasi URL API
# Default URL di mobile/lib/app/modules/login/login_controller.dart menggunakan http://10.0.2.2:8000/api
# URL 10.0.2.2 adalah IP localhost khusus Emulator Android.
# Jika Anda melakukan test di device asli (fisik), ubah 10.0.2.2 menjadi IP Address komputer Anda (misal 192.168.1.5).

# 4. Jalankan Aplikasi
flutter run
```

---

## 🔑 Akun Default (Testing)

Gunakan kredensial ini untuk menguji coba berbagai *role* di sistem. (Atau Anda bisa membuat akun baru di Web Admin).

| Role | Email | Password | Kegunaan |
|---|---|---|---|
| **Super Admin** | admin@admin.com | `password` | Login ke Web Dashboard, tambah Petugas/Ruangan. |
| **Petugas** | petugas@petugas.com | `password` | Login ke Mobile App untuk eksekusi tugas. |
| **Pengguna** | pengguna@pengguna.com | `password` | Login ke Mobile App untuk melapor via QR/Manual. |

---

## 📚 Panduan Lengkap
Repositori ini menyediakan buku manual khusus bagi Admin IT dan Pengguna Akhir.

1. **[Buku Manual Developer & Deployment](MANUAL_BOOK_DEVELOPER.md)**: Baca dokumen ini untuk panduan setup sistem di *production* (VPS, cPanel, Docker, Heroku/Vercel) dan pemecahan masalah (*Troubleshooting*).
2. **[Buku Manual Pengguna](MANUAL_BOOK_USER.md)**: Baca dokumen ini (bisa diekspor ke PDF) untuk diserahkan ke *end-user*, berisi tata cara scan QR dan proses delegasi laporan.
3. **API Documentation**: Silakan impor file `pengaduan-api-collection.json` ke dalam **Postman** untuk menguji endpoint secara mandiri.
