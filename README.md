# Portal Pemilihan Ketua IKA — Next.js + Neon

Versi ini adalah migrasi full-stack dari proyek Laravel/MySQL ke Next.js App
Router dan Neon PostgreSQL. Antarmuka, aset, susunan menu, halaman, kandidat,
dan alur pemilihan dipertahankan dari proyek sumber.

## Teknologi

- Next.js App Router (frontend dan backend dalam satu proyek)
- React + TypeScript
- Next.js Route Handlers untuk login, biodata, voting, impor, dan ekspor
- Neon PostgreSQL melalui `@neondatabase/serverless`
- Cookie sesi bertanda tangan, `httpOnly`, dan `sameSite=lax`
- `bcrypt` untuk password
- ExcelJS untuk impor `.xlsx`/`.csv` dan ekspor `.xlsx`
- Chart.js untuk rekapitulasi suara

## Fitur yang telah dipindahkan

- Dashboard publik dengan desain dan aset asli
- Login pemilih (`/login`) dan administrator (`/admin/login`) yang terpisah
- Administrator tetap dapat mengisi biodata dan mengikuti pemilihan seperti sistem Laravel asli
- Pengisian biodata satu kali
- Pemilihan kandidat satu kali per akun
- Transaksi voting atomik di PostgreSQL
- Halaman ucapan terima kasih setelah memilih
- Rekapitulasi suara khusus admin
- Dashboard administrator dengan ringkasan seluruh data
- CRUD kandidat: tambah, edit, dan hapus
- Kelola akun, peran, password, dan reset hak pilih
- Daftar, detail, dan edit biodata pemilih
- Pencarian pemilih di tabel
- Impor akun dari Excel/CSV
- Ekspor data pemilih ke Excel
- Daftar calon ketua
- Tampilan responsif dan menu seluler
- Logout berbasis POST dengan penghapusan cookie dan redirect penuh sesuai jenis akun

## Mulai cepat

1. Baca [PANDUAN-INSTALASI.md](./PANDUAN-INSTALASI.md).
2. Buat database Neon dan salin connection string.
3. Buka Neon SQL Editor, tempel seluruh isi `database/neon-manual.sql`, lalu
   tekan **Run**.
4. Salin `.env.example` menjadi `.env.local`, lalu isi semua nilainya.
5. Jalankan:

   ```bash
   npm install
   npm run dev
   ```

6. Buka `http://localhost:3000`.
7. Gunakan `http://localhost:3000/login` untuk pemilih atau
   `http://localhost:3000/admin/login` untuk administrator.

## Perintah

```bash
npm run dev        # Server pengembangan
npm run typecheck  # Pemeriksaan TypeScript
npm run lint       # Pemeriksaan kode
npm run build      # Build produksi
npm start          # Menjalankan hasil build
```

## Struktur utama

```text
app/                 Halaman dan backend Route Handlers
components/          Komponen UI interaktif
database/neon-manual.sql Query manual lengkap untuk Neon SQL Editor
database/schema.sql      Referensi struktur tabel PostgreSQL
lib/                 Database, sesi, keamanan, tipe data
public/assets/       Aset tampilan asli dari proyek Laravel
public/storage/img/  Foto dan materi kandidat asli
sample-data/         Contoh data akun dari proyek sumber
```

Referensi resmi: [Next.js App Router](https://nextjs.org/docs/app),
[Neon untuk Next.js](https://neon.com/docs/guides/nextjs), dan
[Next.js di Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
