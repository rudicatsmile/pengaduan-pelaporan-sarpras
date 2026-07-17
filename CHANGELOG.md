# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]

### Added
**Web Admin (Backend & Frontend)**
- [16 Juli 2026] [Antigravity] Ditambahkan fitur **Filter Gedung** pada halaman Pengaduan (Reports) untuk memudahkan penyaringan data berdasarkan gedung.
- [16 Juli 2026] [Antigravity] Ditambahkan fitur **Filter Kategori Jabatan** pada halaman Pengaduan (Reports) untuk memilah laporan berdasarkan tipe petugas pelapor.
- [16 Juli 2026] [Antigravity] Ditambahkan opsi khusus **"Pengaduan Umum (Tanpa Gedung Khusus)"** pada dropdown Filter Gedung untuk menampilkan data pelaporan umum (`pelaporan_umum`) yang tidak terikat dengan sebuah ruangan atau QR gedung.
- [16 Juli 2026] [Antigravity] Diimplementasikan galeri popup interaktif menggunakan `yet-another-react-lightbox` pada halaman Detail Laporan Kinerja (Inspeksi), sehingga gambar pendukung kini dapat di-*zoom*, di-*swipe*, dan dinavigasi (konsisten dengan halaman Detail Pengaduan).

**Mobile App & API**
- [16 Juli 2026] [Antigravity] Ditambahkan dukungan **Filter Gedung** dan **Filter Kategori Jabatan** pada tab "Riwayat Laporan" di aplikasi Mobile (khusus untuk role Super Admin, Admin, dan Supervisor).
- [16 Juli 2026] [Antigravity] Ditambahkan _dropdown item_ **"Pengaduan Umum (Tanpa Gedung Khusus)"** pada filter gedung di aplikasi Mobile agar sesuai dengan Web Admin.
- [16 Juli 2026] [Antigravity] Endpoint API `/api/reports` diperbarui untuk menerima dan memproses parameter `building_id` (termasuk nilai `'umum'`) serta parameter `job_category_id`.

### Fixed
- [16 Juli 2026] [Antigravity] **Bug Hak Akses Supervisor (Web)**: Diperbaiki isu di mana role Supervisor tidak memiliki akses penuh ke menu "Kelola Gedung" di halaman *Users*, sehingga kini hak aksesnya setara dengan Admin dalam mengelola gedung.
- [16 Juli 2026] [Antigravity] **Bug Scope Laporan Supervisor (API/Mobile)**: Diperbaiki kelemahan keamanan data di `Api\ReportController` di mana role Supervisor dan Super Admin sebelumnya dapat melihat semua laporan tanpa dibatasi oleh izin akses *manage-building*. Kini, batasan akses (scope) diterapkan dengan benar di Mobile App, identik dengan aturan yang berlaku di Web Admin.

### Changed
- [16 Juli 2026] [Antigravity] Refaktor filter `building_id` untuk mendukung kombinasi tipe data `integer` (ID gedung) dan `string` (`'umum'`) baik di `ReportController` (Admin/API) maupun *state management* di `history_controller.dart`.
