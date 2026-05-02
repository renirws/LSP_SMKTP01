let API_URL_RAW = (import.meta.env.VITE_SHEET_API_URL || "").trim();

// PEMBERSIHAN URL JITU (Menangani kesalahan copy-paste umum)
function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  
  let clean = rawUrl;
  // Jika user mempaste "VITE_SHEET_API_URL=https://..."
  if (clean.includes("=")) {
    const parts = clean.split("=");
    clean = parts[parts.length - 1];
  }
  
  // Hapus kutipan, spasi, dan titik koma
  clean = clean.replace(/["';\s]/g, "");
  
  // Pastikan URL valid
  if (clean.startsWith("http") && (clean.includes("script.google.com") || clean.includes("exec"))) {
    return clean;
  }
  return "";
}

const API_URL = sanitizeUrl(API_URL_RAW);

if (!API_URL) {
  console.error("VITE_SHEET_API_URL tidak ditemukan. Mohon atur di menu SETTINGS -> SECRETS.");
} else {
  // Log URL yang tersanitasi (setengah bagian saja untuk keamanan)
  const maskedUrl = API_URL.substring(0, 30) + "..." + API_URL.substring(API_URL.length - 10);
  console.log(`[SEO-Debug] API URL Terdeteksi: ${maskedUrl}`);
}

export const sheetService = {
  async read(sheetName: string) {
    if (!API_URL) {
      console.warn("Sinkronisasi Dibatalkan: API URL Kosong.");
      throw new Error("API_URL_MISSING");
    }
    
    try {
      const timestamp = new Date().getTime();
      const separator = API_URL.includes("?") ? "&" : "?";
      // Gunakan URL yang sudah bersih
      const fetchUrl = `${API_URL}${separator}action=read&sheet=${sheetName}&t=${timestamp}`;

      console.log(`[SEO-Senior-Sync] Mencoba sinkronisasi data: ${sheetName}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          redirect: 'follow',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }

        const text = await response.text();
        
        // Diagnosa Konten (Google Login Page Detection)
        if (text.includes("ServiceLogin") || text.includes("google-signin") || text.trim().startsWith("<!DOCTYPE")) {
          console.error("DIAGNOSA SEO: Apps Script masih terproteksi Login Google. Akses publik ditolak.");
          throw new Error("AUTH_REQUIRED_BY_GOOGLE");
        }

        try {
          const data = JSON.parse(text);
          return Array.isArray(data) ? data : [];
        } catch (jsonErr) {
          console.error("JSON Error: Respon bukan JSON yang valid.");
          throw new Error("INVALID_JSON_RESPONSE");
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') throw new Error("TIMEOUT");
        if (err.message === "AUTH_REQUIRED_BY_GOOGLE") throw err;
        if (err.message === "INVALID_JSON_RESPONSE") throw err;
        
        console.error(`[SEO-Debug] Fetch Detail Gagal (${sheetName}):`, err.message);
        // Jika gagal total, lempar error spesifik agar UI tahu ini masalah jaringan
        throw new Error("FAILED_TO_FETCH_NETWORK");
      }
    } catch (error: any) {
      console.error(`Sinkronisasi Gagal (${sheetName}):`, error.message);
      if (["AUTH_REQUIRED_BY_GOOGLE", "TIMEOUT", "FAILED_TO_FETCH_NETWORK", "INVALID_JSON_RESPONSE", "API_URL_MISSING"].includes(error.message)) {
        throw error;
      }
      throw new Error("FAILED_TO_FETCH");
    }
  },

  async create(sheetName: string, data: any) {
    if (!API_URL) return { success: false };
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        redirect: 'follow',
        headers: { "Content-Type": "text/plain" }, 
        body: JSON.stringify({ action: "create", sheet: sheetName, data }),
      });
      return { success: true };
    } catch (error) {
      console.error(`Error creating in ${sheetName}:`, error);
      return { success: false };
    }
  },

  async update(sheetName: string, id: string | number, data: any) {
    if (!API_URL) return { success: false };
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        redirect: 'follow',
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "update", sheet: sheetName, id, data }),
      });
      return { success: true };
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      return { success: false };
    }
  }
};
