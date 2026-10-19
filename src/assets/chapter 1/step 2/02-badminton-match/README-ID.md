# Paket aset 02 — Pertandingan bulutangkis

Tujuh aset PNG dibuat menggunakan imagegen dari referensi pertandingan pengguna. Adaptasi generatif, bukan ekstraksi piksel persis; detail wajah, seragam dan peralatan dapat sedikit berbeda. Paket ini belum merupakan halaman final atau telah diuji di proyek pengguna.

## Cara mulai
Ekstrak ZIP, buka preview.html, lalu berikan folder assets dan ANTIGRAVITY-PROMPT.md kepada agent. manifest.json berisi ukuran, peran, dan status alpha tiap file.

## Isi
- 02-hero-desktop.png: 3:2, komposisi kanan, ruang teks kiri.
- 02-hero-mobile.png: 2:3, komposisi portrait, ruang atas.
- 02-player-red.png dan 02-player-blue.png: pemain transparan lengkap dengan raket; alternatif untuk komposisi terpisah.
- 02-racket.png, 02-shuttlecock.png, 02-shoes.png: dekorasi atau ilustrasi kartu.

## Pilih satu pendekatan
A. Direkomendasikan: gunakan hero sesuai perangkat. Dua pemain sudah ada di dalamnya. Jangan menambahkan kedua cutout di atas hero.
B. Alternatif: susun pemain transparan pada lingkungan buatan sendiri. Jangan memakai hero yang sudah berisi pemain sebagai latarnya.

## Penempatan
Desktop >=1024 px: lapisan visual full-width, terpisah dari container teks max-width 1200 px. Pertahankan rasio 3:2 atau gunakan object-fit:contain; jangan memaksa cover pada panel pendek yang memotong raket atau sepatu. Teks putih dapat ditempatkan pada sekitar 6–40% lebar viewport di sisi kiri yang tenang. Ukuran hero dan teks perlu disesuaikan dengan materi asli.
Mobile <768 px: gunakan hero-mobile dengan width:100% dan height:auto. Judul/tombol sebaiknya dalam alur normal di atas gambar, bukan dipaksakan masuk ke ruang kosong yang kecil. Jangan mengecilkan layout desktop secara utuh.
Raket: dekorasi tepi 180–260 px di area kosong, atau kartu 100–140 px. Shuttlecock: aksen 60–100 px. Sepatu: kartu 100–140 px. Kurangi dekorasi pada mobile, gunakan object-fit:contain.

## Palet awal
Navy #14243D, teks putih #F5F7FB, teks sekunder #BDD1E8, merah #D93435, teal #51B6AE. Nilai awal desain, bukan jaminan warna gambar seragam. Sampel warna tepi hero saat menyambungkan section.

## Sambungan latar
Hero opaque, bukan transparan. Lima objek lainnya memiliki alpha asli. Tempatkan hero tanpa border, radius atau shadow wrapper. Gambar memiliki variasi warna navy di tepian; jika sambungan terlihat, gunakan transisi CSS tipis pada area atmosfer/lantai yang kosong, jangan memudarkan pemain, raket atau kaki. Jangan membuat panel besar berwarna berbeda dari body. UI kartu boleh memiliki bentuk dan border sendiri.

## Performa dan aksesibilitas
PNG adalah master. Buat salinan WebP/AVIF untuk produksi sambil mempertahankan alpha dan periksa lagi hasilnya. Jangan memuat hero desktop dan mobile sekaligus: gunakan picture/media. Dekorasi alt kosong dan pointer-events:none; subjek informatif memiliki alt kontekstual. Hindari animasi berulang yang mengganggu fokus.

## Validasi
Lima cutout diperiksa kanal alphanya. Pemain, raket dan shuttlecock diperiksa di latar navy; celah senar raket dan celah shuttlecock terpisah transparan. Hasil komposit sepatu juga diperiksa. Detail tepi dapat tetap memerlukan penyesuaian pada skala final. Uji implementasi pada desktop 1440 px dan mobile 390 px: keterbacaan, cropping, duplikasi pemain, batas panel dan overflow horizontal.

## Seri
Paket ini memakai awalan 02. Lanjutkan 03–30 sesuai tema sumber. Pertahankan struktur folder dan nama peran; jangan memaksakan palet gelap atau aset olahraga untuk tema lain.
