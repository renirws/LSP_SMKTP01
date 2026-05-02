const API_URL = import.meta.env.VITE_SHEET_API_URL;

export const sheetService = {
  async read(sheetName: string) {
    try {
      const response = await fetch(`${API_URL}?action=read&sheet=${sheetName}`, {
        redirect: 'follow'
      });
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.error) {
          console.warn(`Server error for ${sheetName}:`, data.message);
          return [];
        }
        return data;
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
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script POST requires no-cors often or redirect handling
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", sheet: sheetName, data }),
      });
      return { success: true }; // with no-cors we can't read response but assume success
    } catch (error) {
      console.error(`Error creating in ${sheetName}:`, error);
      return { success: false };
    }
  },

  async update(sheetName: string, id: string | number, data: any) {
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", sheet: sheetName, id, data }),
      });
      return { success: true };
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      return { success: false };
    }
  }
};
