# Paket aset 01 — Pemanasan bulutangkis

Paket pertama untuk rangkaian 30 gambar. Tujuh PNG dibuat dengan imagegen berdasarkan referensi pengguna. Ini adaptasi generatif; detail karakter/peralatan dapat berbeda sedikit dari sumber. Belum merupakan implementasi halaman final.

## Mulai
1. Ekstrak seluruh ZIP.
2. Buka preview.html untuk melihat aset pada latar krem atau gelap.
3. Salin assets/ ke direktori aset proyek.
4. Berikan ANTIGRAVITY-PROMPT.md dan paket ini kepada agent.

## Dua pilihan komposisi
A. Direkomendasikan: hero-desktop / hero-mobile menjadi lingkungan utama. Karakter sudah ada di dalamnya. Tambahkan maksimal dua dekorasi di luar area hero dan tiga ilustrasi kartu.
B. Alternatif: gunakan character.png pada latar yang dibuat terpisah. Jangan menumpuk karakter ini di atas hero karena akan menghasilkan dua orang.

## Spesifikasi penempatan
- Desktop >= 1024 px: area visual memenuhi lebar halaman; konten teks dibatasi max-width sekitar 1200 px, terpusat. Hero rasio asli 3:2; mulai dengan tinggi sekitar 66.67vw agar gambar tidak terpotong. Ukuran ini perlu disesuaikan terhadap konten proyek, bukan dipaksakan sebagai tinggi tetap.
- Teks desktop berada pada 6–40% lebar viewport, di area kiri yang tenang. Jangan menaruh teks di atas tubuh atau net.
- Hero-mobile rasio 2:3. Pada <768 px, judul dan tombol sebaiknya berada di alur dokumen di atas gambar; tampilkan gambar width:100%, height:auto. Jangan memaksakan semua teks ke ruang kosong kecil dalam ilustrasi.
- Racket-shuttle: dekorasi tepi kiri pada transisi hero ke bagian berikutnya, sekitar 180–260 px desktop. Jangan ditempatkan di belakang teks. Boleh dihilangkan di mobile.
- Shuttlecock: dekorasi kecil sisi kanan 70–110 px, atau ikon kartu. Jangan gunakan terlalu banyak salinan.
- Shoes, bottle-towel: ilustrasi kartu sekitar 96–140 px desktop dan 64–88 px mobile. Gunakan object-fit:contain.
- Dasar palet: ivory #F8F5EC, tinta #183B40, merah #D93435, biru #37679D, teal #63B7A8. Ini nilai awal desain, bukan ekstraksi warna presisi.

## Menghindari kotak
Latar hero adalah gambar opaque, bukan cutout. Tempatkan sebagai lingkungan full-width tanpa border-radius atau shadow pada wrapper. Bagian bawah desktop masih memiliki garis lapangan dekat tepi kanan: gunakan transisi bawah tipis yang hanya mengenai lantai, atau sambungkan dengan latar yang serasi. Jangan memudarkan kaki/karakter. Jangan menambahkan gradient putih di semua sisi.
Lima aset objek memiliki kanal alpha asli dan telah diperiksa pada latar krem. Raket masih memiliki bidang string berwarna sangat terang; gunakan pada latar terang untuk integrasi terbaik. Periksa ulang jika memakai latar gelap.

## Performa dan aksesibilitas
PNG merupakan master kualitas tinggi. Sebelum produksi, buat turunan WebP/AVIF yang dioptimalkan dengan mempertahankan alpha, lalu periksa tepi kembali. Jangan memuat ketujuh master pada layar pertama. Hero yang aktif boleh eager; dekorasi bawah lazy. Dekorasi alt kosong, aria-hidden=true dan pointer-events:none. Subjek informatif menggunakan alt yang menjelaskan konteks.

## Validasi sebelum selesai
Bandingkan screenshot pada viewport desktop 1440 px dan mobile 390 px. Pastikan tidak ada overflow horizontal, karakter terpotong, dekorasi menutupi kontrol, duplikasi karakter, atau batas panel besar. Paket ini belum diuji di proyek Antigravity pengguna.

## Standar seri
Gunakan 01-<peran>.png untuk paket ini; lanjutkan 02, 03 hingga 30 dengan peran konsisten. Tema dan jumlah dekorasi boleh menyesuaikan gambar. Jangan memaksakan aset bulutangkis pada tema lain.
