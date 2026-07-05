# Rangkuman Teknis: Deployment & Integrasi SiGAP

Dokumen ini merangkum seluruh langkah teknis yang telah kita capai bersama dalam membawa aplikasi SiGAP dari lingkungan pengembangan lokal ke server produksi (cPanel) secara penuh.

## 1. Integrasi UI Halaman Utama (Frontend)
Pada fase awal, kita memodifikasi antarmuka web:
- **Migrasi React/Inertia**: Mengambil desain statis dari `code.html` dan mengonversinya secara native ke dalam `Welcome.jsx` milik Laravel Inertia.
- **Kustomisasi (*White-labeling*)**: Mengganti seluruh merek menjadi **SiGAP** (Sistem Informasi Pelaporan Gedung dan Prasarana), mengubah bahasa menu menjadi bahasa Indonesia, serta menghapus elemen statis (Company/Legal footer).
- **Aset Dinamis**: Mengonfigurasi tahun *copyright* agar secara otomatis mengikuti tahun server berjalan, dan memuat aset gambar ilustrasi (dummy chart) yang dihubungkan secara dinamis menggunakan sistem Vite.

## 2. Pengemasan Aplikasi (Build & Package)
Agar aplikasi dapat berjalan di lingkungan produksi (Shared Hosting), kita menyiapkan arsitektur *build*:
- **Aset Produksi**: Menjalankan `npm run build` untuk meminifikasi dan menggabungkan JavaScript dan CSS ke dalam `public/build`, sehingga aplikasi siap diakses secara cepat.
- **Isolasi Folder**: Mengemas folder `backend` menggunakan skrip PowerShell (`Compress-Archive`), menyertakan folder `vendor` yang krusial, namun sengaja mengecualikan `node_modules` dan `.git` agar file ZIP `sigap-deploy.zip` memiliki ukuran yang ringan.

## 3. Resolusi Masalah cPanel (Server Debugging)
*Deployment* pada *Shared Hosting* memiliki banyak batasan keamanan (seperti suPHP & pembatasan fungsi). Berikut adalah masalah teknis yang berhasil kita pecahkan:
- **Konflik Versi PHP**: Sempat terjadi *HTTP 500 Error* akibat ketidakcocokan versi. Kita menganalisis `composer.json` dan menemukan bahwa **Laravel 13 membutuhkan PHP 8.3 secara mutlak**. Alih-alih melakukan *downgrade* yang dapat merusak aplikasi, kita menyesuaikan konfigurasi *MultiPHP Manager* cPanel ke PHP 8.3.
- **Izin Berkas (*File Permissions*)**: Terjadi *Permission denied* pada folder `vendor` saat dekompresi file ZIP. Kita menyelesaikannya dengan memastikan *folder* memiliki izin `755` dan file berizin `644`.
- **Integrasi Database**: Mengatasi error tabel hilang (`model_has_roles doesn't exist`) akibat ekspor SQL yang tidak utuh, dengan cara menjalankan `php artisan migrate` secara langsung di server cPanel.
- **Pemblokiran Symlink `exec()`**: cPanel mematikan fungsi `exec()` demi keamanan, menyebabkan perintah bawaan `php artisan storage:link` *crash*. Kita mengakalinya dengan menciptakan fungsi murni PHP (`symlink()`) di dalam `routes/web.php` untuk memunculkan gambar dengan aman tanpa melanggar keamanan server.

## 4. Arsitektur Mobile (Flutter)
Terakhir, kita memodifikasi aplikasi mobile agar terhubung ke server produksi:
- **Injeksi Lingkungan (*Environment*)**: Menghapus *hardcoded* IP statis (seperti `192.168.x.x` dan `localhost`) dan menggantinya dengan paket `flutter_dotenv`. Hal ini memungkinkan aplikasi membaca alamat API dari satu file `.env`.
- **Refactoring URL**: Memperbarui logika resolusi URL gambar pada `task_detail_view.dart` dan `report_detail_view.dart` agar secara otomatis mengenali dan menempelkan domain produksi (`https://sigap.yalwash9.org`).
- **Kompilasi Rilis (*Release Build*)**: Mengeksekusi kompilasi kode native Android (`flutter build apk --release`) yang menghasilkan *Fat APK* sebesar 71.5 MB, siap untuk didistribusikan secara massal dan diinstal oleh para teknisi / pelapor.

> [!TIP]
> **Pesan untuk Pengembang (Developer):** Struktur ini membuat aplikasi SiGAP Anda sangat modular. Jika suatu hari Anda perlu berpindah server lagi, Anda cukup mengubah URL di dalam file `.env` Laravel dan file `.env` Flutter tanpa perlu membongkar atau mencari ribuan baris kode lagi.
