
---

 Panduan Lengkap Mendapatkan API_ID & API_HASH Telegram

1. Buka Website Developer Telegram

Kunjungi: https://my.telegram.org

Tips: Gunakan browser di HP atau PC/laptop.

Ini adalah situs resmi Telegram untuk pengelolaan aplikasi dan developer, tempat kamu membuat aplikasi API Telegram.



---

2. Login dengan Nomor Telegram

Masukkan nomor HP kamu (format internasional, misal: +628xxxxxxx).

Klik Next.

Telegram akan mengirimkan kode verifikasi (OTP) ke aplikasi Telegram kamu (bukan SMS).

Masukkan kode OTP tersebut ke form di website.

Jika login sukses, kamu akan masuk dashboard akun Telegram Developer.



---

3. Masuk ke Menu API Development Tools

Setelah login, pada dashboard pilih menu API development tools.

Menu ini letaknya di bar atas atau di halaman utama setelah login.

Di sini kamu bisa membuat aplikasi baru dan mengelola API Telegram.



---

4. Membuat Aplikasi Telegram (API ID & HASH)

Isi form aplikasi:

App title: Bebas, contoh: OtaxBot, SpamMaster, atau nama kamu sendiri.

Short name: Bebas, satu kata saja, misal: otaxbot.

URL: Boleh kosong (tidak wajib diisi).


Klik Create Application (atau Save jika dalam bahasa Indonesia).

Jika berhasil, halaman akan menampilkan detail aplikasi kamu.



---

5. Ambil dan Simpan API_ID & API_HASH

Setelah aplikasi berhasil dibuat, akan langsung muncul:

API_ID: (angka, biasanya 6-7 digit, misal: 1234567)

API_HASH: (string panjang acak, misal: a1b2c3d4e5f6g7h8i9j0klmnopqrstuv)


JANGAN pernah share API_HASH ke orang lain!

Catat keduanya di file khusus, misal: config.js atau file environment bot-mu.



---

6. Contoh Data

API_ID:    1234567
API_HASH:  1a2b3c4d5e6f7g8h9i0jklmnopqrstuv


---

7. Catatan Penting

Satu akun Telegram bisa membuat beberapa aplikasi API.

API_ID & API_HASH hanya perlu dibuat sekali, bisa dipakai berkali-kali.

Data ini sangat rahasia – jangan dibagikan ke siapa pun, jangan pernah upload ke publik/GitHub.



---

 Panduan Singkat Pemakaian Bot Report Telegram Channel/User

A. Setting Bot & Konfigurasi

1. Pastikan untuk isi file config.js
Isikan:

module.exports = {
  API_ID: '1234567',
  API_HASH: '1a2b3c4d5e6f7g8h9i0jklmnopqrstuv',
  // ... setting lain sesuai kebutuhan
}

---

B. Login Akun GramJS Userbot (Jika diminta)

Saat pertama kali dijalankan, bot akan meminta login dengan nomor Telegram.

gunakan command login lalu Masukkan nomor HP Telegram kamu.

Masukkan kode OTP yang dikirim Telegram (cek aplikasi Telegram kamu).

Jika login sukses, bot siap digunakan.



---

Daftar Command Bot (OTAX Channel/User Report Bot)

Command	Fungsi	Contoh Penggunaan

/ban	Melihat menu bantuan dan seluruh perintah yang tersedia	/ban
/reas / /reasons	Melihat daftar alasan report (key untuk report: spam, porn, scam, dll)	/reasons
/addban <key> <teks>	Menambah template teks report baru untuk alasan tertentu (gunakan %c dan %f)	/addban spam Halo %c, ini spam (%f)
/bantext	Melihat daftar key teks report yang sudah ada beserta jumlahnya	/bantext
/bantext <key>	Melihat preview daftar teks untuk key tertentu (gunakan /1 untuk lihat isi lengkap teks 1)	/bantext porn
/1, /2, dst (setelah bantext)	Melihat isi teks report secara lengkap berdasarkan nomor/urutan pada key terakhir	/1
/banch @channel reason [total] [delay] [teks]	Report channel/public group (otomatis) sebanyak total kali, delay detik, dengan template ke-n	/banch @targetchannel porn 100 3 2
/banuser @username reason [total] [delay] [teks]	Report user (otomatis) sebanyak total kali, delay detik, dengan template ke-n	/banuser @targetuser scam 50 2 1



---

Penjelasan Parameter:

@channel / @username : Username channel/group/user Telegram publik (tanpa link)

reason                : Alasan report (spam, porn, scam, violence, dst; lihat /reasons)

total (opsional)      : Jumlah report (1-600, default 60)

delay (opsional)      : Jeda antar report (detik, default 4)

teks (opsional)       : Nomor urutan template teks yang digunakan, default 1



---

CARA TAMBAH TEKS BAN:

1. Tambahkan template teks:

/addban porn Halo %c, ditemukan konten %f di sini.

%c otomatis diganti dengan target channel/user.

%f otomatis diganti dengan alasan lengkap.





---

CONTOH PEMAKAIAN

1. Report channel dengan alasan pornografi, 100x, delay 3 detik, pakai template ke-2

/banch @chlu porn 100 3 2


2. Report user dengan alasan scam, 20x, default delay, template pertama

/banuser @siUser scam 20


3. Lihat template teks ke-1 pada key "scam"

/bantext scam
/1




---

Tips & Keamanan

Gunakan bot dengan bijak dan sesuai ToS Telegram.

Jangan spam berlebihan pada user/channel yang tidak jelas.

Jangan share API_ID/API_HASH/file session ke siapa pun.



---

Troubleshooting

Jika error “Channel/group tidak ditemukan” → cek username sudah benar & publik.

Jika error login → pastikan nomor dan OTP benar, atau sesi belum expired.

Untuk menambah alasan baru, tambahkan di reasonMap dan reasonFull pada kode.



---

Ringkasan Praktis

1. Dapatkan API_ID/API_HASH di https://my.telegram.org


2. Konfigurasi bot, login, dan isi command sesuai kebutuhan.


3. Untuk semua perintah, selalu gunakan format yang benar.


4. Semua pengelolaan teks report cukup lewat command bot, tanpa perlu edit file manual.




---


