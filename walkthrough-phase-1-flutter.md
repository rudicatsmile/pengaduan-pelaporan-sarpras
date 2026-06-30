# Walkthrough Fase 1: Authentication & Pengaduan QR

Sistem Pelaporan Sarana & Prasarana kini telah memiliki landasan Backend yang kuat serta tampilan Mobile App yang fungsional. Berikut adalah hal-hal yang telah berhasil diimplementasikan di sisi Flutter (Mobile):

## 1. Navigasi & Struktur State Management
Aplikasi menggunakan framework **GetX** untuk manajemen *state*, *dependency injection*, dan *routing*. Struktur direktori yang dibangun memisahkan antara `View` (UI), `Controller` (Logika Bisnis), dan `Binding` (Injeksi Ketergantungan). 
File konfigurasi route ada di `app_pages.dart` dan `app_routes.dart`.

## 2. Splash Screen & Pemeriksaan Sesi (Auth State)
- **Tampilan**: Splash screen bernuansa biru (Material 3) dengan logo `report_problem` dan judul aplikasi.
- **Logika**: Menggunakan `SharedPreferences` untuk mendeteksi apakah pengguna sudah memiliki token aktif. Jika token ditemukan, aplikasi akan langsung menuju **Dashboard Utama (Home)**. Jika tidak, dialihkan ke halaman **Login**.

## 3. Login & Register Screen
- **Login**: Memuat form email dan password, dengan indikator *loading* saat memproses request ke endpoint Laravel Sanctum (`/api/login`). Token yang diterima langsung disimpan di memori lokal.
- **Register**: Form pendaftaran yang memuat Input Nama, Email, No. HP, dan Password.

## 4. Dashboard (Tab Navigation)
Halaman utama diimplementasikan dengan `BottomNavigationBar` yang terintegrasi menggunakan `IndexedStack` agar *state* per halaman tetap terjaga:
- **Tab Home**: Menampilkan card sederhana dan tombol **Floating Action Button (Scan QR)** untuk memulai pelaporan.
- **Tab Riwayat**: Halaman *placeholder* untuk Fase 2 (List laporan pengguna).
- **Tab Profil**: Menampilkan ringkasan profil dan tombol **Logout** yang akan menghapus sesi token dari memori lokal.

## 5. Pemindai QR (QR Scanner)
Menggunakan package `mobile_scanner`. Kamera akan aktif (setelah izin diberikan oleh pengguna). Apabila kamera menangkap QRCode, aplikasi akan mem-parsing string kode ruangan (contoh: `R-001`) dan meneruskannya ke form pelaporan.

## 6. Form Pengaduan Terintegrasi API
Form pengaduan dirancang dengan integrasi `image_picker` untuk mengambil bukti foto, serta terhubung ke endpoint `/api/reports` menggunakan `Dio` via `Multipart/form-data`:
- **Auto-fill Room**: Mendapatkan ID Ruangan dengan menembak API `/api/rooms/{code}` berdasarkan hasil scan QR.
- **Kategori**: Dropdown kategori masalah (Infrastruktur, Kebersihan, Keamanan).
- **Unggah Foto**: Mengambil foto secara langsung dari kamera ponsel.
- **Submit**: Aplikasi akan mengunggah gambar dan metadata ke server backend, lalu menampilkan pemberitahuan (Snackbar) Sukses/Gagal.

> [!TIP]
> Semua *request* HTTP dilakukan melalui `Dio` yang dikonfigurasi ke alamat IP localhost Emulator Android (`10.0.2.2`).

## Langkah Selanjutnya (Fase 2)
Fase 1 secara resmi telah **SELESAI**. Selanjutnya kita bisa lanjut ke **Fase 2: Pelaporan Umum & Dashboard Admin Utama (Inertia React)**.
Di fase berikutnya, kita akan fokus membangun web dashboard admin yang digunakan untuk melihat statistik, serta fitur verifikasi dan delegasi laporan dari pengguna.
