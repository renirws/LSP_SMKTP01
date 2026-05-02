/**
 * GOOGLE APPS SCRIPT: E-LSP FULL SYNC ENGINE
 * Spreadsheet ID: 1kuG0_5-7hK7zjCUGjoBUUZAMGqzrScUFxa7M0iXoUBw
 */

const SS_ID = "1kuG0_5-7hK7zjCUGjoBUUZAMGqzrScUFxa7M0iXoUBw";

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const action = e.parameter.action;
    const sheetName = e.parameter.sheet;
    
    if (action === "read") {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        return createResponse({ error: true, message: "Sheet '" + sheetName + "' tidak ditemukan" });
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length < 2) return createResponse([]); 
      
      // Normalisasi Header: Trim dan hapus spasi berlebih
      const headers = data.shift().map(h => h.toString().trim()); 
      
      const result = data.map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          let val = row[i];
          if (val instanceof Date) val = val.toISOString();
          obj[header] = val;
        });
        return obj;
      });
      return createResponse(result);
    }
  } catch (err) {
    return createResponse({ error: true, message: err.toString() });
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheetName = params.sheet;
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) return createResponse({ success: false, message: "Sheet not found" });

    const dataRows = sheet.getDataRange().getValues();
    // Normalisasi headers untuk penulisan data yang konsisten
    const headers = dataRows[0].map(h => h.toString().trim());

    if (action === "create") {
      const newRow = headers.map(header => params.data[header] || "");
      sheet.appendRow(newRow);
      return createResponse({ success: true, message: "Data created" });
    }

    if (action === "update") {
      const rowIndex = dataRows.findIndex(row => row[0].toString().trim() == params.id.toString().trim());
      if (rowIndex !== -1) {
        headers.forEach((header, i) => {
          if (params.data[header] !== undefined) {
            sheet.getRange(rowIndex + 1, i + 1).setValue(params.data[header]);
          }
        });
        return createResponse({ success: true, message: "Data updated" });
      }
    }
  } catch (err) {
    return createResponse({ success: false, message: err.toString() });
  }
}

function createResponse(content) {
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}
