# EduLearn Cloud - Aplikasi CRUD dengan PostgreSQL dan Persistent Storage

Aplikasi web sederhana untuk menyimpan data pengguna dan file gambar. Dibangun dengan Node.js + Express, menggunakan PostgreSQL (Railway Cloud) sebagai database, dan dapat dijalankan secara lokal maupun di-deploy ke Railway.

---

## Identitas

| Keterangan | Detail |
|------------|--------|
| Nama Lengkap | Sally Oktavina Yusuf |
| Kelas | XII SIJA B |
| Mata Pelajaran | Sistem Informasi, Jaringan dan Aplikasi / PaaS |
| Guru Pengampu | Ibu Margaretha Endah Titisari, S.T. |
| Tanggal | 07 Oktober 2025 |

---

## Deskripsi Singkat

EduLearn Cloud dibuat sebagai tugas Penilaian Tengah Semester (PTS) mata pelajaran Platform as a Service (PaaS) - Ujian Praktik.

Aplikasi ini memiliki fitur:
- Form input pengguna (nama, email, gambar)
- Menyimpan data ke database PostgreSQL
- Upload file ke persistent storage
- Menampilkan galeri pengguna dengan data dan foto
- Menggunakan environment variable untuk keamanan
- Data tetap tersedia setelah re-deploy

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Railway Cloud) |
| Platform PaaS | Railway |
| Storage | Persistent Volume |
| Frontend | HTML5, CSS3, JavaScript |
| Tema Desain | Hitam, Putih, Merah |

---

## Struktur Project

```
edulearn-pts/
│
├── public/
│   └── index.html          # Halaman form input dan galeri
│
├── storage/                # Folder penyimpanan file upload
│   └── .gitkeep           # Placeholder folder
│
├── server.js               # Server utama Node.js
├── .env                    # Konfigurasi environment (tidak di-commit)
├── .env.example            # Template environment variable
├── .gitignore              # File yang diabaikan Git
├── package.json            # Dependencies Node.js
└── README.md               # Dokumentasi ini
```

---

## Langkah-Langkah Implementasi

### LANGKAH 1: Setup Database PostgreSQL di Railway

1. Login ke https://railway.app
2. Klik "New Project" kemudian "Add Plugin" lalu pilih PostgreSQL
3. Railway otomatis membuat database baru
4. Buka tab Variables, salin nilai dari DATABASE_PUBLIC_URL
   
   Contoh:
   ```
   postgresql://postgres:password@containers.railway.app:1234/railway
   ```
5. URL ini akan digunakan di file .env

---

### LANGKAH 2: Buat Project Node.js di Lokal

```bash
# Buat folder project
mkdir edulearn-pts
cd edulearn-pts

# Inisialisasi Node.js project
npm init -y

# Install dependencies
npm install express pg dotenv express-fileupload

# Buat folder yang diperlukan
mkdir storage public
```

---

### LANGKAH 3: Buat File .env

Isi dengan data koneksi dari Railway:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:PzjelySEuAoWnfYVNjNfXBXcGJKDSyfa@shortline.proxy.rlwy.net:28065/railway

# Storage Configuration
STORAGE_PATH=./storage

# Application Configuration
PORT=3000
```

PENTING: File .env harus ditambahkan ke .gitignore. Jangan pernah commit kredensial ke GitHub.

---

### LANGKAH 4: Buat File server.js

File server.js berfungsi untuk:
- Koneksi ke database PostgreSQL
- Membuat tabel users otomatis jika belum ada
- Menyimpan data (nama, email, gambar) ke database
- Menyimpan file upload ke folder /storage
- Menampilkan galeri pengguna dengan gambar

---

### LANGKAH 5: Buat File index.html

Halaman web dengan fitur:
- Form input data pengguna (nama, email, gambar)
- Desain responsif tema hitam, putih, dan merah
- Tombol: Simpan & Upload dan Lihat Data Pengguna
- Galeri pengguna dengan card layout

---

### LANGKAH 6: Jalankan Aplikasi di Lokal

```bash
node server.js
```

Output yang diharapkan:
```
Table "users" checked or created
Server running at http://localhost:3000
```

Buka di browser: http://localhost:3000

---

## Struktur Database (PostgreSQL)

Tabel users akan dibuat otomatis dengan struktur:

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | SERIAL | PRIMARY KEY | ID unik auto-increment |
| name | VARCHAR(100) | NOT NULL | Nama pengguna |
| email | VARCHAR(150) | NOT NULL | Email pengguna |
| image | VARCHAR(255) | NULL | Nama file gambar |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu upload otomatis |

---

## Deployment ke Railway

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit EduLearn PTS"
git branch -M main
git remote add origin https://github.com/sallvyana/edulearn-pts.git
git push -u origin main
```

Pastikan .gitignore sudah berisi:
```
node_modules/
.env
storage/*
!storage/.gitkeep
```

---

### 2. Deploy ke Railway

1. Login ke Railway.app
2. Klik New Project kemudian Deploy from GitHub
3. Pilih repository: edulearn-pts
4. Railway otomatis membaca package.json dan install dependencies
5. Set environment variables di dashboard Railway:
   - DATABASE_URL (dari PostgreSQL plugin)
   - STORAGE_PATH = ./storage
   - PORT = 3000
6. Klik Deploy dan tunggu proses selesai

---

### 3. Hasil Deploy

Aplikasi berhasil dijalankan di Railway

Live URL: https://edulearn-production-ee28.up.railway.app

---

## Alur Kerja Sistem

Berikut adalah alur lengkap bagaimana aplikasi EduLearn Cloud bekerja dari input pengguna hingga penyimpanan data:

### 1. User Mengakses Aplikasi
- Pengguna membuka URL aplikasi di browser
- Browser mengirim HTTPS Request ke server Railway
- Server merespons dengan menampilkan halaman index.html

### 2. User Mengisi Form
- Pengguna mengisi form input:
  - Nama pengguna
  - Email
  - Upload gambar profil
- Klik tombol "Simpan & Upload"

### 3. Backend Memproses Data
Server (server.js) melakukan:
- Menerima data dari form (POST request ke /users)
- Validasi input (nama, email, file)
- Generate nama file unik untuk gambar
- Simpan file ke folder /storage
- Simpan data (nama, email, nama file) ke PostgreSQL Database
- Kirim response "Data berhasil disimpan"

### 4. Penyimpanan di Database dan Storage

Database PostgreSQL:
```sql
INSERT INTO users (name, email, image, created_at) 
VALUES ('Sally', 'sally@example.com', 'profile_123.jpg', NOW());
```

Persistent Storage:
```
/storage/
  └── profile_123.jpg  (tersimpan permanen)
```

### 5. User Melihat Galeri
- Pengguna klik tombol "Lihat Data Pengguna"
- Server mengambil semua data dari database (GET request ke /users)
- Aplikasi menampilkan galeri dengan:
  - Gambar dari folder /storage
  - Nama dan email dari database
  - Tanggal upload

### 6. Re-deploy Aplikasi
Ketika aplikasi di-update dan di-redeploy:
- Container lama dihapus
- Container baru dibuat
- Database PostgreSQL tetap ada (managed service)
- Folder /storage tetap ada (persistent volume)
- Semua data pengguna tetap utuh

Kesimpulan: Data tidak hilang karena disimpan di layer terpisah dari container aplikasi.

---

## Keamanan dan Best Practices

### Yang Sudah Diterapkan:

1. Environment Variables
- Kredensial database disimpan di .env
- File .env di-ignore dari Git menggunakan .gitignore
- Tidak ada hardcoded credentials di kode

2. Persistent Storage
- File upload disimpan di volume terpisah dari container
- Data tidak hilang saat aplikasi di-redeploy
- Folder storage otomatis dibuat jika belum ada

3. Database Connection
- Menggunakan connection pool untuk efisiensi
- SSL/TLS enabled untuk koneksi aman
- Managed database dengan auto-backup dari Railway

4. File Upload Security
- Validasi tipe file yang diizinkan
- Batas maksimal ukuran file
- Nama file di-sanitize untuk mencegah path traversal

---

## Tampilan Aplikasi

### Form Input

- Tema warna: hitam, putih, merah
- Responsif untuk HP dan laptop
- Upload file langsung dari perangkat
- Validasi input real-time

### Galeri Pengguna

- Gambar ditampilkan rapi dalam card grid
- Nama dan email di bawah gambar
- Efek hover saat diarahkan ke card
- Layout responsif (mobile-friendly)

---

## Testing dan Validasi

### Test Case yang Berhasil:

- Koneksi database berhasil tanpa error
- Tabel users dibuat otomatis
- Insert data baru berhasil (CREATE)
- Retrieve semua data berhasil (READ)
- Upload file berhasil tersimpan
- File tetap ada setelah re-deploy
- Environment variable terbaca dengan benar
- Aplikasi berjalan di lokal dan production

---

## Troubleshooting

### Masalah Umum dan Solusi:

**1. Database connection error**
```
Error: connect ECONNREFUSED
```
Solusi: 
- Pastikan DATABASE_URL di .env sudah benar
- Cek koneksi internet
- Verifikasi database Railway masih aktif

**2. File upload gagal**
```
Error: ENOENT: no such file or directory
```
Solusi: 
- Pastikan folder storage sudah dibuat
- Jalankan: mkdir storage

**3. Module not found**
```
Error: Cannot find module 'express'
```
Solusi: 
- Install ulang dependencies: npm install

---

## Lisensi

Proyek ini dibuat untuk keperluan pendidikan (PTS PaaS XII SIJA B)

---

## Acknowledgments

- Ibu Margaretha Endah Titisari, S.T. - Guru Pengampu PaaS
- Railway.app - Platform PaaS yang digunakan
- SMK N 2 Depok Sleman - Institusi pendidikan

---

Dibuat oleh Sally Oktavina Yusuf
Kelas XII SIJA B | Selasa, 07 Oktober 2025

Live Demo: https://edulearn-production-ee28.up.railway.app
GitHub Repository: https://github.com/sallvyana/edulearn-pts