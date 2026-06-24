# Cyber Inventory App

Aplikasi inventory barang berbasis web untuk penggunaan lokal divisi. Backend memakai FastAPI + MongoDB, frontend memakai React + Tailwind CSS dengan tema dark cyber green.

## Struktur

```text
backend/
  app/
    controllers/  # handler request, penghubung route ke service
    models/       # builder dokumen MongoDB
    routes/       # mapping endpoint FastAPI
    services/     # business logic dan akses database
    schemas.py    # validasi request/response Pydantic
  requirements.txt
  .env.example
frontend/
  src/
    components/   # komponen UI reusable
    pages/        # halaman utama dashboard
    services/     # API client
    utils/        # helper format data
  package.json
  .env.example
```

## Fitur

- Login dan register user dengan JWT.
- Role `admin` dan `staff`.
- Input barang: Asset ID, nama, kategori, lokasi, jumlah, dan catatan.
- Waktu masuk barang dicatat otomatis oleh backend saat item dibuat.
- Waktu keluar barang dicatat otomatis ketika peminjaman disetujui.
- Waktu pengembalian dicatat otomatis ketika barang ditandai returned.
- Detail barang dengan informasi stok, tanggal, catatan, dan histori peminjaman.
- Dashboard stok, pending approval, barang sedang dipinjam, dan low stock.
- Request peminjaman: peminjam, divisi, jumlah, tanggal pinjam, target tanggal kembali.
- Approval peminjaman oleh admin.
- Return barang oleh admin dan stok otomatis bertambah kembali.

## Menjalankan MongoDB Lokal

Pastikan MongoDB berjalan di `mongodb://localhost:27017`.

Jika memakai Docker:

```bash
docker run --name inven-cyber-mongo -p 27017:27017 -d mongo:7
```

## Menjalankan Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API berjalan di:

```text
http://localhost:8000
```

Dokumentasi API:

```text
http://localhost:8000/docs
```

## Menjalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## Akun Awal

Buka halaman frontend, lalu pilih register. User pertama boleh dibuat sebagai role `admin` untuk bootstrap sistem. Setelah sudah ada user di database, register admin akan ditolak oleh backend; user berikutnya sebaiknya memakai role `staff`.

Untuk production, pembuatan admin berikutnya sebaiknya melalui panel khusus admin atau proses provisioning internal.

## Tampilan Enterprise

Tampilan yang dipakai adalah dashboard operasional dark cyber dengan gaya seperti referensi premium dashboard:

- Sidebar permanen untuk navigasi Dashboard, Inventory, Peminjaman, dan Approval.
- Topbar dengan search, action icons, refresh, dan profile.
- Dashboard overview dengan KPI cards, operational alerts, pending approval queue, active loans, low stock list, dan recent inventory.
- Latar monokrom gelap untuk fokus kerja dengan aksen cyan, green, amber, purple, dan red sebagai status operasional.
- Tabel rapat agar data inventory mudah discan oleh user operasional.
- Status chip untuk stok, approval, reject, dan returned.
- Empty state dan ringkasan status agar halaman tetap jelas saat database masih kosong.

## Catatan Production Hardening

Untuk benar-benar production-ready di perusahaan, rekomendasi lanjutan:

- Tambahkan audit log untuk perubahan stok, approval, dan return barang.
- Tambahkan role management untuk membuat admin baru dari panel admin.
- Tambahkan pagination dan filter server-side untuk inventory besar.
- Tambahkan backup MongoDB dan environment secret yang dikelola lewat vault/internal secret manager.
- Tambahkan HTTPS, reverse proxy, rate limiting, dan logging terpusat saat deploy.
