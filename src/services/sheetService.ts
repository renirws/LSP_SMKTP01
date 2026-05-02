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
  console.error("VITE_SHEET_API_URL tidak ditemukan atau tidak valid di menu Secrets.");
} else {
  console.log("Sheet Service initialized with API URL.");
}

export const sheetService = {
  async read(sheetName: string) {
    if (!API_URL) {
      console.warn("API URL kosong. Periksa menu Secrets.");
      return [];
    }
    
    try {
      const timestamp = new Date().getTime();
      const separator = API_URL.includes("?") ? "&" : "?";
      const fetchUrl = `${API_URL}${separator}action=read&sheet=${sheetName}&t=${timestamp}`;

      console.log(`[SEO-Senior-Koneksi] Mencoba mengakses: ${sheetName}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow',
        signal: controller.signal
      }).catch(err => {
        clearTimeout(timeoutId);
        console.error("Fetch Exception:", err);
        if (err.name === 'AbortError') throw new Error("TIMEOUT");
        throw new Error("FAILED_TO_FETCH_NETWORK");
      });
      
      clearTimeout(timeoutId);
      
      const text = await response.text();
      
      // Jika dialihkan ke halaman login google, berarti GAS belum 'Anyone'
      if (text.includes("ServiceLogin") || text.includes("google-signin") || text.trim().startsWith("<!DOCTYPE html>")) {
        console.error("DIAGNOSA: Apps Script memerlukan Login Google. Akses publik ditolak.");
        throw new Error("AUTH_REQUIRED_BY_GOOGLE");
      }

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.error("JSON Error: Format respon tidak valid.");
        return [];
      }
    } catch (error: any) {
      console.error(`Error Detailing (${sheetName}):`, error.message);
      if (error.message === "AUTH_REQUIRED_BY_GOOGLE") throw error;
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
