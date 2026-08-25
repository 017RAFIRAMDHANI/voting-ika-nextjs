# Struktur database Neon

- `users`: akun login, peran, status voting, dan hubungan ke biodata.
- `voters`: biodata pemilih serta kandidat yang dipilih.
- `candidates`: profil kandidat dan total suara.

Skema ini mempertahankan relasi dari tabel Laravel `users`, `mahasiswas`, dan
`paslons`, tetapi menggunakan tipe serta batasan PostgreSQL.

Untuk pemasangan manual, buka **Neon Console → SQL Editor**, salin seluruh isi
`neon-manual.sql`, kemudian tekan **Run**. File tersebut sudah mencakup skema,
indeks, tiga kandidat, dan akun admin awal.
