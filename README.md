# StepLuxe — Modern E-Commerce Shoe Store

StepLuxe adalah platform *e-commerce* toko sepatu modern yang dibangun menggunakan stack teknologi terkini. Aplikasi ini dilengkapi dengan katalog produk interaktif, fitur pencarian & penyaringan lengkap, sistem keranjang belanja & wishlist, autentikasi pengguna (JWT), proses checkout & manajemen pesanan, serta **Admin Dashboard**.

---

## Fitur Utama

-  **Katalog & Filter Produk**: Pencarian langsung, filter berdasarkan merek (brand), kategori, rentang harga, ukuran, warna, serta pengurutan (sorting).
-  **Autentikasi & Otorisasi**: Sistem Sign Up / Login menggunakan JWT (JSON Web Token) dengan peran pengguna (*Customer* & *Admin*).
-  **Keranjang & Wishlist**: Manajemen keranjang belanja interaktif, pengaturan jumlah barang, serta simpan ke daftar keinginan (*wishlist*).
-  **Checkout & Transaksi**:
  - Pemilihan alamat pengiriman.
  - Opsi kurir ekspedisi & perkiraan ongkos kirim.
  - Penerapan kode promo / kupon diskon.
  - Pilihan metode pembayaran.
  - Pelacakan status pesanan (*Pending*, *Paid*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
-  **Ulasan & Rating**: Penilaian bintang dan ulasan dari pembeli pada setiap produk.
-  **Admin Dashboard**: Panel manajemen produk, kategori, merek, pesanan pelanggan, dan manajemen stok.

---

## Teknologi yang Digunakan

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: Lucide React
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma ORM
- **Autentikasi**: JWT (jsonwebtoken) & BcryptJS
- **Validasi & Upload**: Zod, Multer

### **Database (Dual Support)**
- **SQLite** *(Default Mode)*: Database file lokal (`dev.db`) tanpa perlu instalasi database server.
- **PostgreSQL** *(Production Ready)*: Didukung penuh via Docker (`docker-compose.yml`).

---

## Panduan Cara Menjalankan

### **Prasyarat**
- **Node.js** v18+ dan **npm** terinstall di komputer Anda.

---

### Mode 1: Memakai SQLite (Sangat Cepat & Tanpa Docker)

1. **Clone repository & masuk ke direktori proyek**:
   ```bash
   git clone <repository-url>
   cd shoe-store
   ```

2. **Install Dependensi (Frontend & Backend)**:
   ```bash
   # Install dependensi frontend
   npm install

   # Install dependensi backend
   cd server
   npm install
   cd ..
   ```

3. **Konfigurasi Environment Backend**:
   Buat file `server/.env` dan isi dengan:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   JWT_SECRET="stepluxe-secret-jwt-key-2026"
   ```

4. **Migrasi Database & Seeding Data**:
   ```bash
   cd server
   npx prisma db push
   node prisma/seed.js
   cd ..
   ```

5. **Jalankan Aplikasi**:
   - **Terminal 1** — Jalankan Backend API:
     ```bash
     cd server
     npm run dev
     ```
     *Backend API berjalan di `http://localhost:3001`*

   - **Terminal 2** — Jalankan Frontend React:
     ```bash
     npm run dev
     ```
     *Frontend berjalan di `http://localhost:5173` atau `http://localhost:5174`*

---

### Mode 2: Memakai PostgreSQL & Docker

Jika Anda ingin menjalankan database di PostgreSQL melalui Docker:

1. **Jalankan Container Docker**:
   ```bash
   docker compose up -d
   ```

2. **Ganti Skema Prisma ke PostgreSQL**:
   Salin file `server/prisma/schema.postgresql.prisma` ke `server/prisma/schema.prisma`.

3. **Update `server/.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/stepluxe?schema=public"
   PORT=3001
   JWT_SECRET="stepluxe-secret-jwt-key-2026"
   ```

4. **Migrasi & Seed Database**:
   ```bash
   cd server
   npx prisma db push
   node prisma/seed.js
   ```

---

## Akun Demo (Pre-seeded Credentials)

Setelah menjalankan perintah `seed.js`, Anda dapat menggunakan akun bawaan berikut:

| Peran | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `demo@stepluxe.id` | `password123` | Belanja, Keranjang, Checkout, Order History |
| **Admin** | `admin@stepluxe.id` | `admin123` | Full Access + Admin Panel Dashboard |

---

## Kode Promo Demo

Gunakan kode promo berikut saat checkout untuk mendapatkan potongan harga:
- `WELCOME10` — Diskon 10%
- `DISKON50K` — Potongan Rp 50.000

---

## Struktur Folder Utama

```
shoe-store/
├── public/                 # Static assets & gambar produk
├── src/                    # Frontend React Source Code
│   ├── components/         # Komponen UI (Navbar, Footer, ProductCard, Modal, dll)
│   ├── data/               # Mock data fallback
│   ├── pages/              # Halaman Aplikasi (Home, Catalog, Detail, Cart, Checkout, Admin, dll)
│   ├── store/              # State management Zustand (auth, cart, product, wishlist)
│   └── utils/              # API Client Axios & helper functions
├── server/                 # Backend Express API Source Code
│   ├── prisma/             # Schema Prisma, Migrasi, & Seed Script
│   ├── src/
│   │   ├── controllers/    # Controller API (auth, product, order, cart, admin, dll)
│   │   ├── middleware/     # Auth & Error handler middleware
│   │   ├── routes/         # Express API routes
│   │   └── index.js        # Main Express server entry point
│   └── .env                # File konfigurasi backend
├── docker-compose.yml      # Konfigurasi PostgreSQL Docker
├── package.json            # Configuration file Frontend
└── README.md               # Dokumentasi proyek
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan demonstrasi dan pengembangan toko online modern.
