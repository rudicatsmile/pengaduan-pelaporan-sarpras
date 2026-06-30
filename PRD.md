# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Judul Proyek**: Sistem Pengaduan dan Pelaporan Online Berbasis QR Code  
**Versi**: 1.0  
**Tanggal**: 30 Juni 2026  
**Pemilik Produk**: Tim Media dan Data
**Tech Stack**: Flutter (Frontend Mobile), React JS + Laravel (Backend), MySQL (Database)

---

## 1. Pendahuluan

### 1.1 Tujuan Produk
Membangun aplikasi mobile yang memudahkan masyarakat melakukan **pengaduan** (berbasis QR Code ruangan) dan **pelaporan** secara cepat, transparan, dan terlacak. Sistem ini juga membantu admin dan petugas dalam mengelola, mendelegasikan, serta menindaklanjuti pengaduan dengan efisien.

### 1.2 Ruang Lingkup
- Pengaduan berbasis QR Code per ruangan/lokasi
- Pelaporan umum
- Manajemen workflow (verifikasi → delegasi → penyelesaian)
- Dashboard admin dan petugas
- Notifikasi status

### 1.3 Out of Scope (Versi 1.0)
- Chat realtime
- Sistem reward/poin
- Integrasi keuangan/ERP
- Versi Web Admin (fokus Mobile dulu)

---

## 2. User Roles & Permissions

| Role                  | Deskripsi                                      | Akses Utama |
|-----------------------|------------------------------------------------|-------------|
| **Pengguna Umum**     | Masyarakat / pengguna akhir                    | Submit pengaduan via QR, submit pelaporan, lihat status sendiri |
| **Admin Pengaduan**   | Pengelola pengaduan                            | Verifikasi, delegasi tugas, monitoring semua data |
| **Petugas**           | Petugas lapangan (maintenance, cleaning, dll) | Terima tugas, update progress, upload bukti selesai |
| **Super Admin**       | Administrator sistem (opsional)                | Kelola user, ruangan, master data, analitik penuh |

---

## 3. Alur Kerja Utama

### A. Pengaduan (QR Code)
1. Pengguna scan QR Code ruangan
2. Isi Nama + Deskripsi + Foto
3. Submit → status **Baru**
4. Admin verifikasi → **Diverifikasi**
5. Admin delegasikan ke Petugas → **Didelegasikan**
6. Petugas proses → **Dalam Proses**
7. Petugas selesaikan + upload bukti → **Selesai**

### B. Pelaporan Umum
1. Pengguna isi Nama, Deskripsi, Foto, Lokasi
2. Submit → masuk ke list yang sama dengan pengaduan

---

## 4. Fitur Detail

### 4.1 Modul Pengguna Umum (Flutter)
- **Scan QR Code** (menggunakan camera)
- Form Pengaduan:
  - Nama pengadu (auto-fill jika login)
  - Kode Ruangan (auto dari QR)
  - Deskripsi
  - Kategori (dropdown)
  - Upload Foto (1-5 foto)
- Form Pelaporan:
  - Nama
  - Deskripsi
  - Kategori
  - Upload Foto
  - Lokasi (GPS/manual)
- Riwayat Pengaduan & Pelaporan Saya
- Notifikasi status perubahan

### 4.2 Modul Admin Pengaduan
- Dashboard overview (jumlah pengaduan baru, dalam proses, selesai)
- List Pengaduan & Pelaporan (filter, search, sort)
- Detail Pengaduan + Riwayat Aktivitas
- Verifikasi & Delegasi ke Petugas
- Update status manual
- Generate & Kelola QR Code Ruangan

### 4.3 Modul Petugas
- List Tugas Saya
- Detail Tugas
- Update Progress + Catatan
- Upload Bukti Penyelesaian (foto sebelum/sesudah)
- Tandai Selesai

### 4.4 Modul Super Admin
- Manajemen User & Role
- CRUD Ruangan + Mass Generate QR Code
- Manajemen Kategori
- Laporan & Analitik
- Konfigurasi Sistem

---

## 5. User Stories Prioritas

**Must Have**
- Sebagai Pengguna, saya dapat scan QR dan submit pengaduan
- Sebagai Pengguna, saya dapat submit pelaporan dengan foto
- Sebagai Admin, saya dapat melihat semua pengaduan dan mendelegasikannya
- Sebagai Petugas, saya dapat menerima tugas dan mengupdate status + bukti

**Should Have**
- Filter dan pencarian lanjutan
- Rating kepuasan setelah penyelesaian

**Could Have**
- Dark Mode
- Multi-language
- Export laporan ke Excel/PDF

---

## 6. Non-Functional Requirements

- **Performance**: Loading list < 2 detik
- **Security**: JWT Authentication, Role-Based Access Control, Input validation, Sanitization
- **Scalability**: Siap handle ratusan pengaduan/hari
- **Usability**: UI/UX yang sederhana dan intuitif
- **Reliability**: Data tidak hilang, soft delete
- **Storage**: Foto dikompresi, disimpan di cloud storage (MinIO/S3)
- **Offline**: Support submit pengaduan saat offline (Flutter)

---

## 7. Asumsi & Dependensi
- Pengguna memiliki smartphone dengan kamera
- QR Code dicetak dan ditempel di setiap ruangan
- Ada koneksi internet untuk submit (dengan offline fallback)

---

## 8. Timeline Estimasi (High Level)
- Phase 1: Authentication + Pengaduan QR 
- Phase 2: Pelaporan + Admin Dashboard 
- Phase 3: Petugas Module + Notifikasi 
- Phase 4: Super Admin + Analitik + Polish 

---

**Disetujui oleh:**  
**Tanggal:** 

---

*Dokumen ini dapat di-update sesuai kebutuhan bisnis.*