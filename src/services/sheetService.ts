let API_URL_RAW = import.meta.env.VITE_SHEET_API_URL?.trim() || "";

// Cek jika user tidak sengaja mempaste "VITE_SHEET_API_URL=" ke dalam secret
if (API_URL_RAW.includes('="')) {
  const match = API_URL_RAW.match(/="([^"]+)"/);
  if (match) API_URL_RAW = match[1];
} else if (API_URL_RAW.includes('=')) {
  API_URL_RAW = API_URL_RAW.split('=')[1];
}

const API_URL = API_URL_RAW.replace(/["']/g, "").trim();

if (!API_URL) {
  console.error("VITE_SHEET_API_URL tidak ditemukan. Pastikan sudah diatur di menu Secrets.");
}

export const sheetService = {
  async read(sheetName: string) {
    if (!API_URL) {
      console.warn("API_URL is missing, skipping read for:", sheetName);
      return [];
    }
    try {
      // Menambahkan cache-buster untuk menghindari data lama (stale)
      const timestamp = new Date().getTime();
      const url = `${API_URL}?action=read&sheet=${sheetName}&t=${timestamp}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        redirect: 'follow',
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const text = await response.text();
      // Verifikasi apakah yang didapat adalah JSON atau HTML Error
      if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
        console.error(`Sheet error: Server mengembalikan HTML bukan JSON. Kemungkinan URL Apps Script salah atau izin akses bukan 'Anyone'.`, text.substring(0, 200));
        return [];
      }
      try {
        const data = JSON.parse(text);
        if (data && data.error) {
          console.warn(`Server error for ${sheetName}:`, data.message);
          return [];
        }
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error(`Gagal parsing JSON untuk ${sheetName}. Respons:`, text.substring(0, 500));
        return [];
      }
    } catch (error) {
      console.error(`Error reading ${sheetName}:`, error);
      return [];
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
