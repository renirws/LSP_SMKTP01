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

      // Menggunakan fetch standar tanpa headers tambahan untuk menghindari preflight CORS yang berat
      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow'
      });
      
      const text = await response.text();
      
      // Jika response diawali <!DOCTYPE, berarti dialihkan ke halaman login Google (Akses Belum 'Anyone')
      if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
        console.error("GAS Error: Response adalah HTML. Akun Google mungkin masih terkunci atau URL salah.");
        return [];
      }

      try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.error("JSON Parsing Error dari Sheets. Periksa struktur kolom.");
        return [];
      }
    } catch (error) {
      console.error(`Fetch Failure for ${sheetName}:`, error);
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
