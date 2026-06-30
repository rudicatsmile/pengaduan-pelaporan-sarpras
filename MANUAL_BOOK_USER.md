# Buku Manual Pengguna 📖

Selamat datang di Panduan Penggunaan Sistem Pelaporan Sarana & Prasarana. Buku manual ini menjelaskan tata cara pengoperasian sistem dari kacamata masing-masing posisi (*Role*). 

> [!NOTE]
> Jika Anda mengalami kendala saat mengakses aplikasi, silakan laporkan ke pihak Administrator IT.

---

## 1. Panduan Untuk "Pengguna Umum" (Pelapor)

Sebagai pengguna umum (Dosen, Karyawan, Mahasiswa, dsb), Anda dapat melaporkan kerusakan yang ada di sekitar Anda menggunakan *Mobile App*.

### Cara Mendaftar dan Login
1. Buka aplikasi di *smartphone* Anda.
2. Jika Anda belum memiliki akun, ketuk tombol **Daftar Akun Baru**.
3. Isi kelengkapan data (Nama, Email, **No WhatsApp Aktif**, dan Password). Pastikan No. WhatsApp benar agar Anda menerima notifikasi penanganan laporan.
4. Setelah mendaftar, lakukan proses **Login** menggunakan Email dan Password Anda.
*(Placeholder Gambar: Screenshot Layar Login/Register)*

### Cara Melapor menggunakan Scan QR Code
1. Pada menu Beranda (Home), tekan tombol **Lapor Kerusakan (Scan QR)**.
2. Arahkan kamera HP Anda ke **Label QR Code** yang tertempel di ruangan atau fasilitas yang rusak.
3. Aplikasi akan otomatis mendeteksi nama ruangan tersebut.
4. Pilih **Kategori Masalah** (Misal: Listrik/Lampu, AC, dsb).
5. Tuliskan deskripsi kerusakan secara detail.
6. Ketuk **Ambil Foto** untuk menjepret bukti fisik kerusakan menggunakan kamera HP Anda.
7. Tekan tombol **Kirim Laporan**. Anda akan menerima notifikasi otomatis via WhatsApp saat laporan diterima.
*(Placeholder Gambar: Screenshot Form Pelaporan)*

### Memantau Status Laporan
1. Pindah ke tab **Riwayat Laporan**.
2. Anda bisa melihat status laporan Anda apakah masih "Menunggu Verifikasi", "Diproses Petugas", atau "Selesai".
3. Anda akan dikirimkan WhatsApp kembali setelah masalah berhasil diperbaiki oleh teknisi!

---

## 2. Panduan Untuk "Petugas" (Teknisi Lapangan)

Sebagai petugas, tampilan aplikasi *mobile* Anda berbeda dengan pengguna biasa. Anda tidak memiliki tombol "Lapor", melainkan "Daftar Tugas".

### Memulai Pekerjaan
1. Buka tab **Beranda** atau **Tugas**.
2. Anda akan melihat daftar perbaikan yang telah didelegasikan oleh Admin khusus untuk Anda. (Anda juga akan mendapat pesan WhatsApp jika ada tugas baru masuk).
3. Ketuk pada salah satu Laporan untuk melihat detail kerusakannya beserta foto bukti awal.
4. Jika Anda siap mengerjakannya, tekan tombol **Proses Tugas**. Sistem akan memberi tahu pelapor bahwa Anda sedang berada di lokasi untuk memperbaiki masalah tersebut.
*(Placeholder Gambar: Screenshot Detail Tugas Petugas)*

### Menyelesaikan Pekerjaan
1. Setelah masalah berhasil diperbaiki, tekan tombol **Selesaikan Tugas**.
2. Anda **wajib** mengambil foto bukti bahwa fasilitas tersebut sudah benar-benar berfungsi/bersih/baik kembali.
3. (Opsional) Anda dapat menulis catatan penyelesaian untuk pelapor.
4. Tekan **Kirim Bukti**. Laporan kini berstatus "Selesai".

---

## 3. Panduan Untuk "Administrator" (Admin Web Dashboard)

Sebagai Admin, Anda memegang kendali penuh atas sistem melalui Dashboard Web (dapat diakses lewat browser komputer). 

### Mengelola Master Data & Mencetak Label QR Code
1. Pada menu navigasi kiri, klik **Master Ruangan**.
2. Klik tombol **Tambah Ruangan** jika ada ruangan baru di gedung.
3. Untuk mencetak label yang akan ditempel di dinding, klik tombol teks hijau **Cetak QR (PDF)** pada baris nama ruangan. Cetak file PDF tersebut menggunakan *printer* standar.
4. Anda juga bisa mengatur tipe komplain di tab **Master Kategori**, serta mendaftarkan dan menghapus akun pegawai di tab **Master User**.
*(Placeholder Gambar: Screenshot Web Master Data & PDF QR)*

### Verifikasi & Delegasi Tugas
1. Saat laporan masuk dari Pelapor, masuklah ke halaman **Laporan**.
2. Klik detail laporan baru tersebut. Periksa bukti fotonya apakah *valid* atau palsu (SPAM).
3. Jika valid, klik tombol **Verifikasi**.
4. Selanjutnya, pilih **Petugas Lapangan** yang tepat pada kolom delegasi. Contoh: Pilih teknisi "Pak Budi" untuk memperbaiki "AC Bocor". Klik **Delegasikan**. Pesan WhatsApp akan otomatis dikirimkan ke HP Pak Budi.
*(Placeholder Gambar: Screenshot Proses Verifikasi di Web)*

### Dasbor Analitik & Ekspor Data
1. Buka halaman **Analitik & Laporan**.
2. Pantau grafik tren bulanan untuk menganalisa seberapa banyak fasilitas yang rusak dari waktu ke waktu.
3. Klik tombol hijau **Download CSV** untuk menarik semua *raw data* pelaporan. File ini bisa Anda buka di Microsoft Excel untuk dilaporkan ke pimpinan (Super Admin).
