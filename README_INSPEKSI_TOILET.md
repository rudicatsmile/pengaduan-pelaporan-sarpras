# Panduan Fitur & Konfigurasi Inspeksi Toilet 3-Jam Sekali - SiGAP

Dokumen ini menjelaskan alur kerja, skema database, serta panduan lengkap untuk melakukan konfigurasi otomatisasi scheduler pada lingkungan produksi **cPanel** maupun **VPS** (Linux).

---

## 1. Desain Fitur & Alur Kerja
* **Jenis Ruangan Baru**: Ruangan toilet diidentifikasi menggunakan kolom `room_type = 'toilet'` di tabel `rooms`.
* **Penugasan Petugas**: Petugas penanggung jawab ditugaskan ke toilet tertentu menggunakan tabel pivot `room_assignments`.
* **Interval Pengecekan**: Scheduler Laravel memantau status toilet setiap 30 menit selama jam kerja (**07:00 - 17:00**).
* **Kriteria Terlambat (Overdue)**: Toilet belum diinspeksi dalam **3 jam terakhir** sejak inspeksi terakhir, atau belum pernah diinspeksi sama sekali.
* **Sistem Notifikasi**: Petugas penanggung jawab menerima pesan **WhatsApp (via Wablas)** serta log **Notifikasi Database** di aplikasi.
* **Rate Limiting**: Notifikasi keterlambatan untuk toilet yang sama dibatasi maksimal kirim sekali per 3 jam untuk menghindari spam.

---

## 2. Struktur Database Baru

### A. Kolom `room_type` pada tabel `rooms`
* **Nama Kolom**: `room_type`
* **Tipe Data**: `enum('general', 'toilet')`
* **Default**: `general`

### B. Tabel Pivot `room_assignments`
* `id` (Primary Key)
* `room_id` (Foreign Key -> `rooms.id`)
* `user_id` (Foreign Key -> `users.id`)
* `created_at` / `updated_at`

---

## 3. Konfigurasi Produksi

### 🛠️ Opsi A: Setup Scheduler pada cPanel (Shared Hosting)
Untuk menjalankan otomatisasi scheduler di cPanel, Anda hanya perlu mendaftarkan **satu Cron Job** yang memicu engine scheduler Laravel setiap menit.

1. Masuk ke dashboard **cPanel** Anda.
2. Cari menu **Cron Jobs** (Tugas Cron) di bagian *Advanced*.
3. Di bagian **Common Settings**, pilih **Once Per Minute (* * * * *)** atau isi manual kolom waktu dengan bintang (`*`).
4. Pada kolom **Command**, masukkan perintah berikut (sesuaikan path project Anda):
   ```bash
   cd /home/nama_user/public_html && php artisan schedule:run >> /dev/null 2>&1
   ```
   *Catatan:*
   * Ganti `/home/nama_user/public_html` dengan path direktori root Laravel Anda di cPanel.
   * Pastikan versi PHP default CLI yang digunakan di terminal cPanel adalah PHP 8.3 (sesuai kebutuhan Laravel project). Jika perlu menentukan versi PHP secara eksplisit, gunakan path aslinya, contoh: `/usr/local/bin/ea-php83 artisan schedule:run`.

---

### 🖥️ Opsi B: Setup Scheduler pada VPS (Ubuntu/Debian)
Jika Anda menggunakan VPS sendiri, Anda dapat menggunakan sistem Cron bawaan Linux atau Systemd.

#### Metode 1: Menggunakan System Cron (Direkomendasikan)
1. Masuk ke terminal VPS Anda via SSH.
2. Buka editor crontab dengan perintah:
   ```bash
   crontab -e
   ```
3. Tambahkan baris berikut di bagian paling bawah file:
   ```bash
   * * * * * cd /var/www/pengaduan-pelaporan/backend && php artisan schedule:run >> /dev/null 2>&1
   ```
4. Simpan dan keluar. Cron service akan otomatis memuat konfigurasi baru ini.

#### Metode 2: Menggunakan Systemd Timer (Untuk kontrol logging lebih baik)
Jika Anda tidak ingin menggunakan Cron, Anda bisa membuat Unit File Systemd.
1. Buat file Service (`/etc/systemd/system/sigap-scheduler.service`):
   ```ini
   [Unit]
   Description=Run Laravel Scheduler
   After=network.target

   [Service]
   Type=oneshot
   User=www-data
   WorkingDirectory=/var/www/pengaduan-pelaporan/backend
   ExecStart=/usr/bin/php artisan schedule:run
   ```
2. Buat file Timer (`/etc/systemd/system/sigap-scheduler.timer`):
   ```ini
   [Unit]
   Description=Run Laravel Scheduler every minute

   [Timer]
   OnBootSec=1min
   OnUnitActiveSec=1min

   [Install]
   WantedBy=timers.target
   ```
3. Aktifkan dan jalankan timer:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now sigap-scheduler.timer
   ```

---

## 4. Pengujian Fitur secara Manual
Anda dapat memicu pemeriksaan toilet secara manual melalui terminal (CLI) tanpa perlu menunggu cron job berjalan:
```bash
php artisan app:check-toilet-inspections
```

Bila berhasil, Anda akan melihat log seperti:
* `Toilet Toilet Lantai 1 dalam kondisi aman`
* `Notifikasi dikirim ke petugas Budi untuk toilet Toilet Lantai 2`
