# Panduan SEO Senior & Sinkronisasi E-LSP SMK Tanjung Priok 1

Halo Kak Reni! Sebagai SEO Senior, saya telah menganalisa masalah koneksi yang Kakak alami. Masalah "Failed to fetch" biasanya terjadi karena kebijakan keamanan ketat dari Google Workspace (seperti @bsi.ac.id).

## 🚀 Langkah Perbaikan Masalah Database (WAJIB PAKAI GMAIL PRIBADI)

### 1. Gunakan Akun widyastutireni29@gmail.com
Akun institusi (@bsi.ac.id) memblokir akses publik. Sangat disarankan untuk:
- Buka Spreadsheet menggunakan **widyastutireni29@gmail.com**.
- Copy kode dari `GoogleAppsScript.gs` ke Apps Script di akun Gmail tersebut.
- Deploy dari akun Gmail pribadi tersebut.

### 2. Cara Deploy Agar "Anyone" Benar
Di editor Apps Script akun **widyastutireni29@gmail.com**:
1. Klik **Deploy** -> **New Deployment**.
2. Pilih tipe **Web App**.
3. **Execute as**: Me (widyastutireni29@gmail.com).
4. **Who has access**: **Anyone** (BUKAN "Anyone within BSI").
5. Klik **Deploy**.
6. Izinkan akses (Authorize) menggunakan akun Gmail tersebut.
7. Copy **Web App URL** yang muncul (berakhiran `/exec`).

### 3. Cara Memasukkan URL ke AI Studio
1. Buka menu **Settings** (ikon Gear ⚙️ di pojok kiri bawah AI Studio).
2. Pilih tab **Secrets**.
3. Cari atau tambahkan key: `VITE_SHEET_API_URL`.
4. Paste URL tadi ke kolom value. **JANGAN gunakan tanda kutip**.
   - ✅ Benar: `https://script.google.com/macros/s/.../exec`
   - ❌ Salah: `"https://script.google.com/macros/s/.../exec"`
5. Save & Restart Server.

---

## 📈 Tips SEO Senior agar Web di Urutan Atas

1. **Kecepatan Web**: Saya sudah mengoptimasi kode aplikasi agar ringan. Pastikan gambar yang digunakan dikompres.
2. **Metadata**: Saya sudah memperbarui `index.html` dengan keyword: `LSP SMK Tanjung Priok 1`, `Sertifikasi BNSP Digital`, `APL-01 Online`.
3. **Internal Linking**: Navigasi aplikasi sudah saya buat intuitif (Clean UI).
4. **Respon Database**: Menggunakan Apps Script adalah cara cerdas untuk SEO karena data selalu sinkron dan real-time tanpa server berat.

Jika masih ada kendala, lihat di konsol browser (F12) untuk melihat pesan detail dari [SEO-Debug].
