---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #f5f5f5
color: #333333
style: |
  section {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding: 40px;
  }
  h1 {
    color: #047857;
  }
  h2 {
    color: #065f46;
    border-bottom: 2px solid #047857;
  }
  footer {
    font-size: 0.5em;
    color: #777;
  }
  .highlight {
    color: #047857;
    font-weight: bold;
  }
---

# **SIGAP**
### Sistem Informasi Pelaporan Gedung & Prasarana
##### Solusi Manajemen Aset & Pelaporan Kerusakan Real-Time

---

## **Latar Belakang**

* **Proses Pelaporan Manual & Lambat:** Pelapor sering kesulitan melaporkan kerusakan sarana karena alur yang birokratis dan tidak praktis.
* **Kurangnya Akurasi Lokasi:** Pengelola kesulitan mengidentifikasi posisi prasarana atau ruangan spesifik yang mengalami kerusakan.
* **Manajemen Aset Tidak Terpusat:** Tidak adanya data terpusat mempersulit pemantauan riwayat kondisi aset secara berkala.

---

## **Solusi: Aplikasi SIGAP**

SIGAP hadir sebagai platform terintegrasi yang menghubungkan pelapor di lapangan dengan pengelola gedung secara langsung.

* **Mobile App (Android/iOS):** Untuk pelaporan instan secara mandiri oleh pengguna/staf di lokasi.
* **Web Admin Dashboard:** Pusat kendali untuk memantau, memverifikasi, dan menjadwalkan perbaikan/inspeksi aset.
* **Integrasi QR Code:** Setiap ruangan dilengkapi QR Code unik untuk mempercepat identifikasi lokasi kerusakan.

---

## **Teknologi yang Digunakan**

* **Backend & Admin Panel:** 
  * **Laravel** (Robust REST API & Business Logic)
  * **React & Inertia.js** (Sleek, Modern, & Responsive Web Dashboard)
* **Mobile App:** 
  * **Flutter** (Performa tinggi native Android/iOS)
  * **GetX State Management** (Aplikasi responsif dan ringan)

---

## **Alur Kerja Utama (User Flow)**

```
[Ruangan / Aset] ──> [Scan QR Code] ──> [Isi Form Laporan di Mobile]
                                                     │
                                                     ▼
[Selesai / Diperbaiki] <── [Inspeksi Aset] <── [Verifikasi Web Admin]
```

1. **Scan QR Code:** Pelapor memindai kode QR yang terpasang di ruangan.
2. **Kirim Laporan:** Mengunggah detail kerusakan beserta foto bukti.
3. **Tindakan Admin:** Admin menerima notifikasi, memverifikasi, dan menugaskan tim inspeksi.

---

## **Fitur Utama: Aplikasi Mobile**

* **Scan QR Code Instan:** Otomatis mendeteksi detail ruangan tanpa perlu input manual.
* **Form Pelaporan Cepat:** Input judul laporan, kategori sarana, deskripsi, serta foto bukti kerusakan.
* **Antarmuka Modern (Sleek & Clean):** User-friendly sehingga dapat digunakan oleh siapa saja tanpa pelatihan khusus.

---

## **Fitur Utama: Web Admin Dashboard**

* **Statistik Real-Time:** Grafik laporan masuk, diproses, selesai, dan tren kerusakan.
* **Manajemen Data Master:** Pengaturan data lantai, ruangan, kategori aset, dan pengguna.
* **Generator QR Code:** Cetak QR Code otomatis berformat PDF untuk setiap ruangan langsung dari sistem.
* **Inspeksi Aset Berkala:** Modul khusus untuk melacak riwayat perawatan gedung dan prasarana.

---

## **Nilai Tambah & Keuntungan Bisnis**

* **Efisiensi Waktu:** Memangkas birokrasi pelaporan tradisional hingga <span class="highlight">80%</span>.
* **Response Time Lebih Cepat:** Tim teknisi langsung mengetahui lokasi presisi kerusakan melalui data QR Code.
* **Optimalisasi Umur Aset:** Pemeliharaan preventif yang lebih baik melalui riwayat inspeksi berkala.
* **Keputusan Berbasis Data:** Laporan analitik membantu manajemen mengalokasikan anggaran perbaikan dengan tepat.

---

# **Terima Kasih**
### **Ada Pertanyaan?**

*SIGAP - Sistem Informasi Pelaporan Gedung & Prasarana*
