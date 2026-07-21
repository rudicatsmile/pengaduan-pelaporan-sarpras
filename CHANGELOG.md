# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]

### Added
**Web Admin (Backend & Frontend)**
- [17 Juli 2026] [Antigravity] Menambahkan fitur **Filter Tanggal (Dari & Sampai)** pada halaman Pengaduan, Inspeksi, dan Inspeksi Aset. Desain menggunakan 2 input tanggal yang disatukan secara visual dalam sebuah kotak "Filter Rentang Waktu" agar tidak tercampur dengan filter lainnya. Fitur ini sangat intuitif: dapat digunakan untuk memfilter tepat 1 hari (hanya mengisi "Dari Tanggal") ataupun dalam rentang tanggal tertentu (mengisi "Dari Tanggal" dan "Sampai Tanggal").
- [17 Juli 2026] [Antigravity] Menambahkan fitur analitik **Rekap Kinerja Petugas** pada halaman Inspeksi (Kinerja). Fitur ini berwujud *Slide-over Drawer* interaktif yang muncul dari sisi kanan layar, memuat rekap daftar petugas beserta status agregasi apakah mereka "Sudah Lapor" atau "Belum Lapor" secara dinamis berdasarkan filter rentang waktu yang sedang aktif. Di dalam drawer ini juga dilengkapi *Segmented Control* modern untuk memfilter daftar secara cepat (Semua / Sudah Lapor / Belum Lapor), serta sebuah kotak *Dropdown* khusus untuk memfilter berdasarkan "Kategori Jabatan".
- [17 Juli 2026] [Antigravity] Mengimplementasikan sistem **Paging (Pagination)** bergaya modern SaaS pada halaman Pengaduan, Inspeksi, dan Inspeksi Aset. Paginasi kini dilengkapi dengan fitur *dropdown combobox* "Jumlah Baris" di mana admin bisa memilih batas data per halaman (10, 25, 50, 100) atau langsung mengetik angka berapapun sesuai kebutuhan.
- [17 Juli 2026] [Antigravity] Memperbaiki isu *blank screen* pada rendering komponen Pagination akibat ketidaksesuaian property rendering JSX.
- [17 Juli 2026] [Antigravity] Memperbarui kolom "Status" pada halaman Pengaduan (Reports) untuk menampilkan nama dan avatar petugas yang ditugaskan (jika status "Didelegasikan") serta nama user yang menyelesaikan laporan (jika status "Selesai"), sehingga pelacakan progress menjadi lebih jelas secara visual.
- [17 Juli 2026] [Antigravity] Memperbarui desain UI pada menu Inspeksi: tombol "Aksi" ('Lihat Detail') diperbarui menjadi tombol modern yang lebih interaktif dengan ikon, dan kolom "Status" kini menampilkan avatar serta nama admin/supervisor yang pertama kali membaca laporan.
- [17 Juli 2026] [Antigravity] Menambahkan migrasi database field `read_by_id` pada tabel `inspections` untuk menyimpan informasi user yang telah membaca laporan kinerja.
- [16 Juli 2026] [Antigravity] Ditambahkan fitur **Filter Gedung** pada halaman Pengaduan (Reports) untuk memudahkan penyaringan data berdasarkan gedung.
- [16 Juli 2026] [Antigravity] Ditambahkan fitur **Filter Kategori Jabatan** pada halaman Pengaduan (Reports) untuk memilah laporan berdasarkan tipe petugas pelapor.
- [16 Juli 2026] [Antigravity] Ditambahkan opsi khusus **"Pengaduan Umum (Tanpa Gedung Khusus)"** pada dropdown Filter Gedung untuk menampilkan data pelaporan umum (`pelaporan_umum`) yang tidak terikat dengan sebuah ruangan atau QR gedung.
- [16 Juli 2026] [Antigravity] Diimplementasikan galeri popup interaktif menggunakan `yet-another-react-lightbox` pada halaman Detail Laporan Kinerja (Inspeksi), sehingga gambar pendukung kini dapat di-*zoom*, di-*swipe*, dan dinavigasi (konsisten dengan halaman Detail Pengaduan).

**Mobile App & API**
- [16 Juli 2026] [Antigravity] Ditambahkan dukungan **Filter Gedung** dan **Filter Kategori Jabatan** pada tab "Riwayat Laporan" di aplikasi Mobile (khusus untuk role Super Admin, Admin, dan Supervisor).
- [16 Juli 2026] [Antigravity] Ditambahkan _dropdown item_ **"Pengaduan Umum (Tanpa Gedung Khusus)"** pada filter gedung di aplikasi Mobile agar sesuai dengan Web Admin.
- [16 Juli 2026] [Antigravity] Endpoint API `/api/reports` diperbarui untuk menerima dan memproses parameter `building_id` (termasuk nilai `'umum'`) serta parameter `job_category_id`.

### Fixed
- [17 Juli 2026] [Antigravity] **Bug Filter Tanggal (Zona Waktu)**: Memperbaiki isu di mana filter tanggal meleset 1 hari (misal: memfilter 16 Juli tapi memunculkan data 17 Juli). Masalah ini terjadi karena konversi zona waktu antara format UTC di database dan Waktu Indonesia Barat (WIB) di browser. Filter tanggal di backend (Controllers) kini secara eksplisit memperhitungkan *offset* waktu Asia/Jakarta sebelum melakukan *query* ke database.
- [16 Juli 2026] [Antigravity] **Bug Hak Akses Supervisor (Web)**: Diperbaiki isu di mana role Supervisor tidak memiliki akses penuh ke menu "Kelola Gedung" di halaman *Users*, sehingga kini hak aksesnya setara dengan Admin dalam mengelola gedung.
- [16 Juli 2026] [Antigravity] **Bug Scope Laporan Supervisor (API/Mobile)**: Diperbaiki kelemahan keamanan data di `Api\ReportController` di mana role Supervisor dan Super Admin sebelumnya dapat melihat semua laporan tanpa dibatasi oleh izin akses *manage-building*. Kini, batasan akses (scope) diterapkan dengan benar di Mobile App, identik dengan aturan yang berlaku di Web Admin.

### Changed
- [16 Juli 2026] [Antigravity] Refaktor filter `building_id` untuk mendukung kombinasi tipe data `integer` (ID gedung) dan `string` (`'umum'`) baik di `ReportController` (Admin/API) maupun *state management* di `history_controller.dart`.
