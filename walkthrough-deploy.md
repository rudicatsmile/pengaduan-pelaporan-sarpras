# Panduan Deployment cPanel SiGAP

File aplikasi Anda telah selesai di-*build* untuk produksi dan dikemas dalam bentuk ZIP yang siap diunggah ke cPanel.

## Persiapan File
Di komputer Anda, periksa folder:
`d:\Softwares\projects\web\pengaduan-pelaporan\sigap-deploy.zip`
File ini berisi seluruh *source code* backend, termasuk `vendor`, file aset React/Inertia hasil kompilasi (`public/build`), dan sudah **bersih** dari folder `.git` maupun `node_modules` sehingga ukurannya ringan.

---

## Langkah 1: Setup Database
1. Buka cPanel Anda dan cari menu **MySQL® Databases**.
2. Buat database baru (misal: `domainco_sigap`).
3. Buat _Database User_ baru lengkap dengan kata sandinya, lalu klik **Add User To Database** dan centang **All Privileges**. Catat nama database, user, dan kata sandi ini.
4. Kembali ke beranda cPanel, buka **phpMyAdmin**.
5. Pilih database `domainco_sigap` yang baru dibuat, lalu klik tab **Import**. Unggah file `.sql` dari komputer Anda untuk memulihkan tabel dan data awal.

## Langkah 2: Unggah Aplikasi
1. Di cPanel, buka **File Manager**.
2. Masuk ke dalam direktori *Subdomain* atau *Addon Domain* tempat aplikasi akan berjalan (contoh: `public_html/sigap`).
3. Klik tombol **Upload** di bagian atas, lalu pilih file `sigap-deploy.zip` yang sudah saya buatkan tadi.
4. Setelah 100% selesai, kembali ke File Manager, klik kanan pada `sigap-deploy.zip` lalu pilih **Extract**.
5. Pastikan folder dan file Laravel (`app`, `routes`, `public`, `.env`, dll) terekstrak langsung di dalam folder root subdomain tersebut (bukan di dalam sub-folder). Hapus file `.zip` untuk menghemat ruang.

## Langkah 3: Konfigurasi Environment (`.env`)
1. Di File Manager, cari file `.env`. *(Jika tidak terlihat, klik "Settings" di pojok kanan atas File Manager, dan centang "Show Hidden Files")*.
2. Klik kanan file `.env` dan pilih **Edit**. Sesuaikan baris berikut:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://subdomain.domainanda.com
   ```
3. Gulir ke bawah ke bagian pengaturan Database, lalu masukkan kredensial yang Anda buat di Langkah 1:
   ```env
   DB_DATABASE=domainco_sigap
   DB_USERNAME=domainco_user
   DB_PASSWORD=katasandirahasia
   ```
4. Simpan perubahan.

## Langkah 4: Pengaturan Keamanan (Document Root)
> [!IMPORTANT]
> Langkah ini sangat **KRITIKAL** untuk keamanan aplikasi Laravel.

Aplikasi Laravel dirancang untuk dijalankan dari direktori `public`, bukan dari direktori *root*. 
1. Di beranda cPanel, cari menu **Domains** atau **Subdomains**.
2. Cari domain/subdomain aplikasi Anda di tabel.
3. Klik pada baris *Document Root* (atau klik *Manage* -> *Update the domain*).
4. Ubah jalurnya agar menunjuk ke direktori `public` di dalam folder Anda. 
   - **Salah:** `/public_html/sigap`
   - **Benar:** `/public_html/sigap/public`
5. Simpan pengaturan. Ini mencegah siapapun mengunduh file `.env` Anda melalui peramban.

## Langkah 5: Hubungkan Storage File
Aplikasi ini menyimpan gambar unggahan (bukti pelaporan) di folder storage tertutup. Anda perlu membuat *shortcut* symlink. Karena Anda tidak menggunakan SSH:
1. Setelah aplikasi berjalan, cukup kunjungi alamat berikut di peramban Anda:
   `https://subdomain.domainanda.com/symlink`
2. Anda akan melihat pesan **"Storage linked successfully!"**. (Saya sudah menambahkan rute khusus ini di `routes/web.php` untuk mempermudah Anda).
3. Selesai! Aplikasi SiGAP kini sudah ter-deploy sepenuhnya dengan aman dan benar.
