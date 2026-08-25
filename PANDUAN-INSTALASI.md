# Panduan pemasangan sampai berjalan

## 1. Persiapan

Siapkan:

- Node.js 20.9 atau lebih baru; Node.js 22 LTS direkomendasikan.
- Akun [Neon](https://console.neon.tech/).
- Akun [Vercel](https://vercel.com/).
- GitHub bersifat opsional, tetapi paling mudah untuk deployment berulang.

Ekstrak ZIP, buka terminal di folder `voting-ika-nextjs`, kemudian cek:

```bash
node --version
npm --version
```

## 2. Membuat database Neon

1. Masuk ke Neon dan pilih **New project**.
2. Pilih region yang dekat dengan mayoritas pengguna.
3. Setelah project dibuat, buka **Connect**.
4. Pilih connection string yang pooled/serverless bila pilihan tersebut tersedia.
5. Salin URL PostgreSQL lengkap yang diawali `postgresql://`.
6. Pada Neon Console, buka **SQL Editor**.
7. Buka file `database/neon-manual.sql` dari proyek ini, salin seluruh isinya,
   tempel ke SQL Editor, kemudian tekan **Run**.
8. Pastikan hasil verifikasi menampilkan tiga kandidat dan satu akun admin.

Query tersebut aman dijalankan ulang dan tidak mereset suara. Akun awalnya:

```text
User ID : 2341030
Password: 2341030
```

Sebelum produksi, jalankan query ganti password yang sudah tersedia di bagian
paling bawah `database/neon-manual.sql`.

Panduan resmi tersedia pada
[Connect a Next.js application to Neon](https://neon.com/docs/guides/nextjs).

## 3. Mengatur variabel lokal

Duplikasi `.env.example` menjadi `.env.local`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
SESSION_SECRET=RAHASIA_ACAK_MINIMAL_32_KARAKTER
```

Buat `SESSION_SECRET` acak dengan Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Jangan memasukkan `.env.local` ke Git atau ZIP publik.

## 4. Memasang dependensi

```bash
npm install
```

## 5. Menjalankan di komputer

```bash
npm run dev
```

Buka aplikasi sesuai jenis pengguna:

- Login pemilih: `http://localhost:3000/login`
- Login administrator: `http://localhost:3000/admin/login`
- Dashboard administrator setelah berhasil masuk: `http://localhost:3000/admin`

Gunakan halaman **Login Administrator** untuk akun admin yang dibuat oleh query
manual pada langkah 2. Halaman `/login` hanya menerima akun pemilih.

Administrator juga dapat mengikuti pemilihan. Setelah masuk, pilih menu
**Pemilihan Ketua IKA**. Jika biodata administrator belum tersedia, sistem akan
mengarahkan ke `/biodata` satu kali, kemudian membuka `/pemilihan` setelah
biodata disimpan. Logout administrator kembali ke `/admin/login`, sedangkan
logout pemilih kembali ke `/login`.

Uji koneksi database melalui `http://localhost:3000/api/health`. Respons yang
benar berisi `"ok": true` dan `"database": "connected"`.

## 6. Memasukkan akun pemilih

1. Login sebagai admin melalui `/admin/login`.
2. Buka `http://localhost:3000/excel`.
3. Unggah `sample-data/databook.xlsx`, atau file `.xlsx`/`.csv` lain.
4. Kolom A harus berisi **User ID**, kolom B **Nama Pengguna**.
5. Password awal setiap pemilih sama dengan User ID, sesuai sistem lama.

Impor ulang User ID yang sama akan memperbarui nama dan password akun tersebut,
bukan membuat duplikat.

## 7. Memeriksa build produksi

Sebelum deployment:

```bash
npm run typecheck
npm run lint
npm run build
```

Pastikan Next.js selalu diperbarui ke patch keamanan terbaru sebelum produksi:

```bash
npm install next@latest eslint-config-next@latest
```

Ulangi pemeriksaan build setelah pembaruan.

## 8. Deployment ke Vercel melalui GitHub

1. Buat repository GitHub kosong.
2. Unggah semua isi folder proyek, kecuali `.env.local`, `.next`, dan
   `node_modules`.
3. Di Vercel pilih **Add New → Project**.
4. Impor repository tersebut. Vercel akan mendeteksi Next.js otomatis.
5. Buka **Environment Variables** dan tambahkan:

   - `DATABASE_URL`
   - `SESSION_SECRET`

   Pilih Production, Preview, dan Development sesuai kebutuhan. Dokumentasi
   resminya ada di [Vercel Environment Variables](https://vercel.com/docs/environment-variables).

6. Tidak perlu mengubah Build Command, Output Directory, atau Install Command.
7. Pilih **Deploy**.
8. Setelah selesai, buka `https://DOMAIN-ANDA/api/health`.

Skema dan data awal tidak perlu dijalankan lagi oleh Vercel karena sudah dibuat
langsung melalui Neon SQL Editor.

## 9. Deployment tanpa GitHub

Pasang Vercel CLI lalu jalankan dari folder proyek:

```bash
npm install -g vercel
vercel
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel --prod
```

Ikuti pertanyaan di terminal. Pilih framework **Next.js** dan pertahankan root
directory pada folder proyek ini.

## 10. Alur pemeriksaan akhir

1. Buka dashboard publik.
2. Buka `/admin/login`, login sebagai admin, lalu cek **Hasil Suara** serta
   **Data Pemilih**.
3. Impor satu akun uji di `/excel`.
4. Logout, lalu login sebagai akun uji melalui `/login`.
5. Isi biodata.
6. Pilih satu kandidat.
7. Pastikan halaman terima kasih muncul.
8. Login lagi melalui `/admin/login`; hasil suara dan data pemilih harus bertambah.
9. Klik **Export to Excel** pada halaman Data Pemilih.

## Pemecahan masalah

### `DATABASE_URL belum dikonfigurasi`

Pastikan `.env.local` berada di root proyek. Di Vercel, pastikan variabel telah
disimpan pada environment yang benar lalu lakukan redeploy.

### `SESSION_SECRET minimal 32 karakter`

Buat nilai baru dengan perintah generator pada langkah 3. Nilai lokal dan
Vercel boleh berbeda, tetapi pengguna akan perlu login ulang saat nilainya
berubah.

### Login benar tetapi kembali ke halaman login

Pastikan Anda memakai versi proyek `1.0.3` atau lebih baru. Versi ini sudah
menormalkan ID `BIGSERIAL` dari Neon sebelum membuat sesi dan menyesuaikan
atribut keamanan cookie dengan protokol HTTP/HTTPS. Setelah mengganti berkas
proyek, hentikan server lama, hapus folder `.next`, lalu jalankan kembali:

```bash
npm install
npm run dev
```

Jika login tetap gagal, pesan pada formulir akan menunjukkan apakah
`DATABASE_URL` atau `SESSION_SECRET` belum benar.

### Database tidak terhubung

Pastikan connection string Neon masih aktif, berisi `sslmode=require`, dan tidak
memiliki spasi tersembunyi. Gunakan driver HTTP yang sudah ada di proyek ini;
jangan menggantinya dengan koneksi TCP biasa untuk fungsi serverless.

### Build gagal setelah pembaruan paket

Hapus hasil build lokal lalu pasang ulang:

```bash
rm -rf .next node_modules
npm install
npm run build
```

Pada Windows, hapus folder `.next` dan `node_modules` melalui File Explorer atau
PowerShell sebelum menjalankan ulang `npm install`.
