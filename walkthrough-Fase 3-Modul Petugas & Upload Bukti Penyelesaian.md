# Walkthrough Keseluruhan: Fase 1, 2, dan 3 Lengkap!

Sistem Pelaporan Sarana & Prasarana kini telah memiliki alur **End-to-End** yang utuh dari pembuatan laporan oleh pengguna, hingga penyelesaian masalah oleh petugas di lapangan. Berikut adalah rangkuman perjalanan aplikasi yang telah diselesaikan.

## 1. Modul Pengguna (Fase 1 & 2)
- **Pelaporan QR**: Pengguna dapat memindai QR code pada ruangan/barang untuk melaporkan kerusakan (otomatis mengisi data ruangan).
- **Pelaporan Umum**: Pengguna juga dapat memasukkan lokasi kerusakan secara manual jika tidak memiliki QR Code.
- **Riwayat**: Pengguna dapat memantau perkembangan laporannya (Menunggu, Diproses, Selesai) lengkap dengan rincian riwayat perubahan.

## 2. Modul Admin Web (Fase 2)
- Admin memiliki *Dashboard* tersendiri yang menampilkan analitik / statistik laporan secara *real-time*.
- Admin dapat melihat lampiran (foto) laporan, lalu melakukan **Verifikasi** untuk menerimanya.
- Setelah diverifikasi, admin akan **Mendelegasikan** tugas tersebut kepada petugas di lapangan (terdapat dropdown khusus untuk memilih Petugas).

## 3. Modul Petugas (Fase 3 - **TERBARU!**)
- **Login Petugas**: Ketika user dengan peran `petugas` melakukan login di Mobile App (Flutter), maka tampilan `HomeView` (Beranda) akan otomatis berubah menampilkan antarmuka khusus Petugas ("Tugas Anda").
- **Daftar Tugas (Task List)**: Petugas dapat melihat daftar laporan yang secara spesifik *didelegasikan* kepada mereka, dan mengambil tindakan.
- **Detail Tugas & Proses**:
  - Petugas dapat membuka detail tugas untuk menekan tombol **Mulai Proses Tugas** (status akan berubah menjadi `proses` dan otomatis tersimpan di log).
  - Ketika pekerjaan selesai di lapangan, petugas mengisi **Catatan Penyelesaian (Opsional)** dan mengambil **Foto Bukti Selesai (Wajib)** menggunakan kamera *smartphone* untuk kemudian mengunggahnya.
- **Selesai**: Status laporan akan menjadi `selesai`. Pengguna pelapor akan dapat melihat perubahan status dan foto hasil kerja petugas di riwayat laporan milik mereka.

---

> [!TIP]
> Alur utama kini sudah selesai 100%! Untuk mengujinya:
> 1. Gunakan user biasa untuk login/register di Mobile dan buat laporan.
> 2. Login di browser ke Web Admin, masuk ke *Dashboard*, periksa laporan baru, dan Verifikasi -> Delegasikan ke "petugas@gmail.com".
> 3. Logout di Mobile App, login kembali menggunakan akun Petugas (contoh: email `petugas@gmail.com`). 
> 4. Selesaikan tugas yang diterima dengan melampirkan foto bukti, dan lihat hasilnya.

## Langkah Selanjutnya (Fase 4: Final Polish)
Fase terakhir (Fase 4) akan meliputi pengembangan CRUD untuk manajemen Data Induk (Ruangan, Kategori, User, QR Code PDF) di Web Admin, serta sedikit polesan *(polish)* visual di Mobile jika diperlukan.
