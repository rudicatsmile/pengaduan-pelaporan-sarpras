# Buku Manual Developer & Deployment 💻

Buku ini ditujukan bagi Administrator IT atau DevOps yang bertanggung jawab untuk meng-*hosting* dan memelihara aplikasi Sistem Pelaporan Sarpras di *environment production*.

Aplikasi backend kita menggunakan **Laravel 11.x (PHP 8.2)**. Pastikan spesifikasi server memenuhi standar Laravel terbaru.

---

## Opsi 1: Deployment di VPS (Ubuntu / Nginx) - *Rekomendasi Utama*

VPS memberikan kontrol penuh atas *cron job* dan servis supervisor.

### Langkah-langkah Dasar:
1. **Instalasi Paket Dasar**: 
   Pastikan Anda menginstal PHP 8.2 (berserta ekstensi php-fpm, php-mbstring, php-xml, php-mysql, php-curl, dll), Nginx, MySQL, dan Node.js.
2. **Kloning Repositori**:
   ```bash
   cd /var/www/
   git clone https://github.com/rudicatsmile/pengaduan-pelaporan-sarpras.git
   cd pengaduan-pelaporan-sarpras/backend
   ```
3. **Persiapan Dependencies**:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install && npm run build
   ```
4. **Setup Environment**:
   Ubah file `.env`, pastikan kredensial `DB_*` benar. Ubah `APP_ENV=production` dan `APP_DEBUG=false`. Isikan Token API Wablas jika ada.
5. **Konfigurasi Database & Storage**:
   ```bash
   php artisan migrate --force
   php artisan storage:link
   ```
6. **Izin Folder (Permissions)**:
   ```bash
   chown -R www-data:www-data /var/www/pengaduan-pelaporan-sarpras/backend
   chmod -R 775 storage bootstrap/cache
   ```

### Konfigurasi Nginx (`/etc/nginx/sites-available/sarpras`)
```nginx
server {
    listen 80;
    server_name sarpras.domainanda.com;
    root /var/www/pengaduan-pelaporan-sarpras/backend/public;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```
*Jangan lupa melakukan `ln -s` ke `sites-enabled` dan me-restart Nginx.*

---

## Opsi 2: Deployment di Shared Hosting (cPanel)

Jika menggunakan cPanel, Anda tidak memiliki akses ke terminal *root*, sehingga beberapa modifikasi struktur folder diperlukan.

1. Kompres (ZIP) folder `backend` dari komputer lokal Anda **setelah** menjalankan `composer install` dan `npm run build`.
2. Upload ZIP tersebut ke dalam *File Manager* di direktori sejajar dengan `public_html` (Bukan di dalamnya). Misal: `/home/username/backend/`.
3. Pindahkan **isi** dari folder `backend/public/` ke dalam folder `public_html/`.
4. Edit file `index.php` yang kini ada di dalam `public_html/`:
   ```php
   // Cari dua baris berikut dan ubah jalurnya
   require __DIR__.'/../backend/vendor/autoload.php';
   $app = require_once __DIR__.'/../backend/bootstrap/app.php';
   ```
5. Sesuaikan file `.env` di dalam folder `/home/username/backend/`.
6. Buat file Symlink untuk *Storage* melalui Cron Job atau Script PHP:
   Buat file `symlink.php` di dalam `public_html`:
   ```php
   <?php
   symlink('/home/username/backend/storage/app/public', '/home/username/public_html/storage');
   echo "Symlink berhasil dibuat!";
   ```
   Akses `domainanda.com/symlink.php`, kemudian hapus file tersebut demi keamanan.

---

## Opsi 3: Deployment menggunakan Docker Container

Jika Anda menerapkan infrastruktur modern berbasis container.

1. **Buat file `Dockerfile`** di folder `backend`:
   ```dockerfile
   FROM php:8.2-fpm
   RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev zip unzip
   RUN docker-php-ext-install pdo_mysql gd
   WORKDIR /var/www
   COPY . .
   RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
   RUN composer install --no-dev --optimize-autoloader
   ```
2. **Buat file `docker-compose.yml`**:
   Anda akan butuh 3 container utama: `app` (PHP-FPM), `web` (Nginx), dan `db` (MySQL). Pastikan untuk me-*mount* volume `/var/www/storage`.

---

## Opsi 4: Deployment di Cloud PaaS (Heroku / AWS Elastic Beanstalk)

Aplikasi Laravel sangat kompatibel didorong ke PaaS seperti Heroku.
1. Tambahkan file `Procfile` di direktori *backend*:
   ```text
   web: vendor/bin/heroku-php-apache2 public/
   ```
2. Hubungkan repositori Anda via Heroku CLI atau Dashboard.
3. Atur *Environment Variables* (`APP_KEY`, `DB_URL`) di dalam konfigurasi *Settings* aplikasi Heroku.
4. Karena Heroku memiliki *ephemeral storage*, Anda **wajib** mengubah driver file upload dari `public` (lokal) ke Amazon S3 (`FILESYSTEM_DISK=s3`). Edit pengaturan storage AWS Anda di `.env`.

---

## 🛠️ Troubleshooting (Pemecahan Masalah)

**1. Gambar Laporan / Foto Bukti tidak muncul di Web Admin?**
* **Penyebab**: Symlink storage belum terbentuk.
* **Solusi**: Masuk ke terminal server dan jalankan `php artisan storage:link`. Jika menggunakan cPanel, gunakan metode script `symlink.php` seperti dijelaskan di atas.

**2. Error "The environment file is invalid! (WABLAS_API_DOMAIN)"**
* **Penyebab**: Adanya karakter tak terlihat (seperti UTF-16 BOM) pada file `.env` karena modifikasi di teks editor yang salah (contoh: Powershell Echo).
* **Solusi**: Buat ulang file `.env` menggunakan `nano .env` dan ketik ulang konfigurasinya dengan format ASCII standar.

**3. Error "CORS (Cross-Origin Resource Sharing)" di Mobile App**
* **Penyebab**: Aplikasi *mobile* gagal menghubungi server backend karena URL diblokir (biasanya jika Anda mendeploy backend ke IP tanpa nama domain HTTPs).
* **Solusi**: Di Laravel 11, CORS dikendalikan di konfigurasi internal. Anda dapat memaksa header untuk akses publik pada file `bootstrap/app.php` jika diperlukan (meski *default* Laravel API sudah *open* CORS). Pastikan aplikasi *mobile* Anda menggunakan protokol yang sama dengan server (Hindari mencampur panggilan HTTPS dengan HTTP lokal).

**4. Notifikasi WhatsApp Tidak Masuk!**
* **Penyebab Utama**: Token Wablas kedaluwarsa, tidak ada kuota, atau format nomor HP pelapor/petugas tidak menggunakan format internasional (contoh harus diawali `62` atau `08`).
* **Solusi**: Cek file log backend di `storage/logs/laravel.log`. Anda akan melihat pesan seperti `[Error] Wablas exception to 08...`. Pastikan saldo API Wablas mencukupi.
