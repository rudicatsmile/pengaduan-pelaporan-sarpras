# Walkthrough Fase 1 & 2: Pelaporan, Riwayat, & Web Admin

Sistem Pelaporan Sarana & Prasarana telah berhasil menyelesaikan **Fase 1 dan Fase 2**. Sistem kini sudah berfungsi dari hulu ke hilir untuk proses *User Lapor* sampai ke *Admin Verifikasi*.

## 1. Pelaporan Umum (Tanpa QR)
Selain pemindai QR Code, kini pengguna (melalui Mobile App) dapat melaporkan kerusakan yang tidak ber-QR menggunakan fitur **Pelaporan Umum**.
- Pengguna hanya perlu mengetikkan **Lokasi Kejadian** secara manual.
- Mengisi Kategori, Deskripsi, dan Foto Bukti persis seperti form pengaduan QR.
- Data ini juga akan masuk ke sistem melalui API `POST /api/reports`.

## 2. Riwayat Laporan (Mobile)
- Tab **Riwayat** di halaman Home pengguna kini telah aktif.
- Aplikasi Mobile akan menarik data laporan pengguna melalui API `GET /api/reports` menggunakan `HistoryController`.
- Status laporan ditampilkan dengan menggunakan *Status Badge* yang mudah dibaca (*Menunggu*, *Diverifikasi*, *Didelegasikan*, *Proses*, *Selesai*, *Ditolak*).
- Mengetuk salah satu laporan akan mengarahkan pengguna ke **Halaman Detail Laporan** yang menampilkan lampiran foto dan riwayat aktivitas (*Log* status).

## 3. Dashboard Web Admin (Inertia React)
Bagian manajemen web sudah berfungsi dengan fitur-fitur berikut:
- **Login Admin**: Menggunakan scaffold default Laravel Breeze (React + Inertia).
- **Statistik Dashboard**: Menampilkan rekapitulasi data (Total laporan, jumlah laporan Menunggu, Diproses, dan Selesai).
- **List Semua Laporan**: Tabel yang mencatat semua laporan yang masuk beserta identitas pelapor, tipe, lokasi, dan status terkini.
- **Detail Laporan (Verifikasi & Delegasi)**:
  - Admin dapat meninjau lampiran foto dari aplikasi mobile.
  - Admin dapat menekan tombol **Verifikasi Laporan** untuk mengubah status laporan dari `menunggu` ke `diverifikasi`.
  - Setelah diverifikasi, Admin dapat menekan tombol **Delegasikan**, lalu memilih *Petugas* dari dropdown list, dan mengirim tugaskan kepada petugas tersebut.

## 4. Log Aktivitas Berjalan
Setiap kali laporan dibuat, diverifikasi, atau didelegasikan, backend akan merekam catatan aktivitas di dalam tabel `report_activities`. Log ini bisa dilihat oleh pengguna melalui halaman Detail Laporan di Mobile App agar transparansi laporan tetap terjaga.

---

> [!TIP]
> Keseluruhan fitur ini sudah di-*commit* ke repository. Anda dapat menguji flow di atas dengan menjalankan aplikasi mobile (Flutter) bersamaan dengan web backend (PHP Artisan Serve + NPM Run Dev).

## Langkah Selanjutnya (Fase 3)
Fase selanjutnya adalah **Fase 3: Modul Petugas**. Pada fase ini, kita akan fokus menangani alur kerja "Petugas", di mana petugas akan melihat tugas yang didelegasikan dari admin, menandainya sebagai "Sedang Diproses", lalu mengunggah *Foto Bukti Resolusi* untuk menyelesaikannya.
