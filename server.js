require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// === 1️⃣ Buat tabel otomatis kalau belum ada ===
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" checked or created');
  } catch (err) {
    console.error('❌ Error creating table:', err);
  }
})();

// === 2️⃣ Setup storage path ===
const storagePath = process.env.STORAGE_PATH || path.join(__dirname, 'storage');
if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));
app.use('/storage', express.static(storagePath));

// === 3️⃣ Halaman utama (form input) ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// === 4️⃣ Route: Tambah data + upload file ===
app.post('/add', async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.files?.file;

    if (!name || !email || !file) {
      return res.status(400).send('❌ Harap isi semua kolom dan unggah file.');
    }

    // Simpan file
    const fileName = Date.now() + '_' + file.name;
    const savePath = path.join(storagePath, fileName);
    await file.mv(savePath);

    // Simpan data ke database
    await pool.query(
      'INSERT INTO users (name, email, image) VALUES ($1, $2, $3)',
      [name, email, fileName]
    );

    res.send(`
      <html>
        <body style="background-color:black;color:white;text-align:center;font-family:Arial;">
          <h1 style="color:red;">✅ Data & file berhasil disimpan!</h1>
          <p>Nama: ${name}</p>
          <p>Email: ${email}</p>
          <img src="/storage/${fileName}" alt="${name}" style="max-width:200px;border:2px solid red;border-radius:8px;margin:10px;">
          <div style="margin-top:20px;">
            <a href="/" style="color:red;">⬅ Kembali</a> |
            <a href="/users" style="color:red;">📋 Lihat Data</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('❌ Gagal menambahkan data:', err);
    res.status(500).send('❌ Terjadi kesalahan saat menambahkan data.');
  }
});

// === 5️⃣ Route: Galeri pengguna (gambar + info) ===
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
    const rows = result.rows;

    let html = `
      <html>
        <head>
          <title>Galeri Pengguna</title>
          <style>
            body {
              background-color: #000;
              color: #fff;
              font-family: Arial, sans-serif;
              text-align: center;
              margin: 0;
              padding: 20px;
            }
            h1 {
              color: #f00;
              margin-bottom: 20px;
            }
            .gallery {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 25px;
            }
            .card {
              background: #111;
              border: 2px solid #f00;
              border-radius: 10px;
              width: 220px;
              padding: 10px;
              transition: transform 0.2s;
            }
            .card:hover {
              transform: scale(1.05);
            }
            .card img {
              width: 100%;
              height: 180px;
              object-fit: cover;
              border-radius: 8px;
              border: 1px solid #f00;
            }
            .info {
              margin-top: 8px;
              color: #fff;
            }
            a {
              color: #f00;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>🖼️ Galeri Pengguna</h1>
          <div class="gallery">
            ${rows.map(u => `
              <div class="card">
                <img src="/storage/${u.image}" alt="${u.name}">
                <div class="info">
                  <p><b>${u.name}</b></p>
                  <p>${u.email}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:30px;">
            <a href="/">⬅ Kembali ke Form</a>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error('❌ Gagal menampilkan data:', err);
    res.status(500).send('❌ Gagal menampilkan data.');
  }
});

// === 6️⃣ Jalankan server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
