# 🎉 Online Test & Anti-Cheat System Selesai

Sistem ujian online terintegrasi (E-Rekrut) telah selesai dibangun melalui 4 fase secara menyeluruh. Berikut adalah ringkasan fitur-fitur baru dan panduan penggunaannya.

## ✨ Fitur Utama yang Dikerjakan

### 1. Manajemen Bank Soal (Admin)
Admin kini memiliki menu **Bank Soal** untuk mengelola seluruh materi ujian:
- **Kategori Soal**: Mengelompokkan soal (contoh: Logika, Psikologi, Koding).
- **Berbagai Tipe Soal**:
  - **Pilihan Ganda**: Soal dengan multi-opsi.
  - **Benar/Salah**: Pernyataan *True/False*.
  - **Mencocokkan**: Pasangkan item kolom kiri ke kolom kanan.
  - **Essay**: Pertanyaan bebas yang harus dinilai manual oleh admin.
- **Tingkat Kesulitan & Bobot**: Setiap soal memiliki label *Mudah/Sedang/Sulit* dan bobot poin yang bisa diatur.

### 2. Test Management & Randomisasi (Admin)
Pembuatan "Template Test" baru yang dinamis (Menu **Test Management**):
- **Setting Fleksibel**: Atur durasi ujian (menit), passing grade (%), dan opsi visibilitas hasil ke pelamar.
- **Auto-Randomisasi**: Selain memilih soal secara manual, admin dapat menambahkan *Rule* (contoh: Ambil secara acak 5 soal *Mudah* dari kategori *Logika*). Sistem akan men-generate paket soal berbeda-beda (unik) untuk setiap pelamar saat mereka memulai test.
- **Integrasi Lowongan**: Test bisa langsung di-assign ke lowongan tertentu. Ketika pelamar diubah statusnya menjadi `Competency Test`, mereka otomatis mendapat akses ke ujian ini.

### 3. Review Attempt & Grading (Admin)
- Admin dapat melihat **Log Pelamar** saat mengerjakan ujian.
- **Skor Otomatis**: Soal pilihan ganda, benar/salah, dan mencocokkan langsung dinilai otomatis oleh sistem.
- **Grading Essay**: Admin disediakan UI khusus untuk memberikan nilai pada soal essay beserta opsi menambah catatan khusus dari penilai.
- Setelah semua essay dinilai, admin bisa menekan **Finalisasi Grading** agar skor total dihitung dan status akhir (Lulus/Gagal) ter-update.

### 4. Applicant Test UI & Anti-Cheat (Pelamar)
- **Instruksi & Persetujuan**: Pelamar harus membaca tata tertib sebelum memulai.
- **UI Modern & Fokus**: Layar ujian bersifat *fullscreen*, dengan sidebar navigasi soal, fitur penanda ragu-ragu (*flag*), dan auto-save otomatis di *background* tiap kali pelamar menjawab soal. Timer berjalan live di layar.
- **Anti-Cheat Terintegrasi**: Sistem *hook* mendeteksi secara *real-time*:
  - Keluar dari *fullscreen*.
  - Berpindah tab (blur/visibility change).
  - Tindakan *Copy / Paste*.
  - Klik kanan (Context Menu).
  - *Shortcut keyboard* seperti F12, PrintScreen.
- Jika pelamar mencapai *Max Violations* (batas maksimum pelanggaran yang diatur Admin), test akan **langsung dihentikan dan disubmit paksa (Auto-Submit)**.

---

## 🛠️ Panduan Pengujian (Cara Test Sendiri)

1. **Sebagai Admin**:
   - Buat Kategori Soal.
   - Buat beberapa soal di Bank Soal.
   - Pergi ke Test Management -> Buat Test baru (set durasi, maks pelanggaran misal 3x, dan assign ke Lowongan aktif).
   - Pastikan ada pelamar (akun applicant) yang statusnya diubah menjadi `Competency Test`.

2. **Sebagai Pelamar**:
   - Login dengan akun pelamar. Buka halaman **Lamaran Saya**.
   - Akan muncul tombol biru **"Mulai Test Kompetensi"**.
   - Tekan dan setujui instruksi. Browser akan *request fullscreen*.
   - Silakan coba pindah tab (ALT+TAB) atau tekan tombol ESC (keluar fullscreen) untuk mengetes notifikasi peringatan Anti-Cheat. Lakukan lebih dari 3x (jika limit diset 3) untuk melihat trigger Auto-Submit paksa.

3. **Kembali Sebagai Admin**:
   - Buka menu Test Management, lihat detail Test tersebut, atau dari Detail Pelamar.
   - Cek Review Attempt untuk melihat rincian pelanggaran (di tab Anti-Cheat Log). Jika ada soal essay, beri nilai, lalu *Finalisasi Grading*.

---

> [!TIP]
> Semua fitur telah di-build (`npm run dev` dan `php artisan serve` saat ini berjalan). Silakan dicoba dan direview melalui antarmuka web.
