# Panduan SEO Senior & Sinkronisasi E-LSP SMK Tanjung Priok 1

Halo Kak Reni! Sebagai SEO Senior, saya telah menganalisa masalah koneksi yang Kakak alami. Masalah "Failed to fetch" biasanya terjadi karena kebijakan keamanan ketat dari Google Workspace (seperti @bsi.ac.id).

## 🚀 Langkah Perbaikan "Failed to fetch" (WAJIB!)

Jika Kak Reni masih melihat error **"Network Error"** atau **"Failed to fetch"**:

### 1. Masalah Akun Workspace (@bsi.ac.id)
Akun institusi memiliki aturan internal yang sering memblokir akses meski sudah di-set "Anyone". 
- **SOLUSI**: Gunakan akun **gmail.com** (pribadi) untuk membuat dan men-deploy Apps Script.

### 2. Pengaturan Browser
Beberapa browser (seperti Brave atau Chrome dengan ekstensi tertentu) memblokir koneksi lintas situs (CORS).
- **SOLUSI**: Coba buka aplikasi di **Tab Baru** atau gunakan browser lain (seperti Microsoft Edge atau Chrome standard) tanpa VPN.

### 3. Cara Memasukkan URL di AI Studio (Menu Secrets)
Banyak pengguna salah memasukkan URL. Pastikan:
1. Buka **Settings (Gear ⚙️)** di AI Studio.
2. Pilih sub-menu **Secrets**.
3. Pastikan ada nama `VITE_SHEET_API_URL`.
4. Masukkan URL aslinya **TANPA tanda kutip**.
   - Contoh Benar: `https://script.google.com/macros/s/AKfy.../exec`
   - Jangan masukkan: `"https://script.google.com/macros/s/AKfy.../exec"`

---

## 📈 Update Email Admin
- Email admin sekarang disetel ke: **widyastutireni29@gmail.com**
- Username admin: **admin_lsp**

---

## 📈 Tips SEO Senior agar Web di Urutan Atas

1. **Kecepatan Web**: Saya sudah mengoptimasi kode aplikasi agar ringan. Pastikan gambar yang digunakan dikompres.
2. **Metadata**: Saya sudah memperbarui `index.html` dengan keyword: `LSP SMK Tanjung Priok 1`, `Sertifikasi BNSP Digital`, `APL-01 Online`.
3. **Internal Linking**: Navigasi aplikasi sudah saya buat intuitif (Clean UI).
4. **Respon Database**: Menggunakan Apps Script adalah cara cerdas untuk SEO karena data selalu sinkron dan real-time tanpa server berat.

Jika masih ada kendala, lihat di konsol browser (F12) untuk melihat pesan detail dari [SEO-Debug].
