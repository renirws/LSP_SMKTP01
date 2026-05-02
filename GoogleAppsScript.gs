/**
 * GOOGLE APPS SCRIPT: E-LSP SMK TANJUNG PRIOK 1
 * Deskripsi: Skrip untuk memetakan data Google Sheets ke Template PDF APL-01 & APL-02.
 * Petunjuk: Pasang skrip ini di Extensions > Apps Script pada Google Sheets Database.
 */

const TEMPLATE_ID_APL01 = "YOUR_DOC_ID_APL01";
const FOLDER_OUTPUT_ID = "YOUR_FOLDER_ID_PDF";

function generateLSPReport(idApl01) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAPL01 = ss.getSheetByName("Data_APL01");
  const data = sheetAPL01.getDataRange().getValues();
  
  let asesiData = null;
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] == idApl01) { // Kolom ID_APL01 (PK)
      asesiData = {
        noReg: data[i][2],
        tglDaftar: Utilities.formatDate(new Date(data[i][3]), "GMT+7", "dd-MM-yyyy"),
        skema: data[i][4],
        alamat: data[i][5],
        pendidikan: data[i][6],
        // Ambil Nama dari relasi User_Auth jika perlu, atau asumsikan ada di baris
        nama: data[i][2] // Sesuaikan index jika nama ditambahkan ke APL01
      };
      break;
    }
  }

  if(!asesiData) return "Data tidak ditemukan";

  const copyDoc = DriveApp.getFileById(TEMPLATE_ID_APL01).makeCopy(`APL01_${asesiData.nama}_${idApl01}`, DriveApp.getFolderById(FOLDER_OUTPUT_ID));
  const doc = DocumentApp.openById(copyDoc.getId());
  const body = doc.getBody();

  // Mapping dengan Tag Template
  body.replaceText("{{NO_REGISTRASI}}", asesiData.noReg);
  body.replaceText("{{TGL_DAFTAR}}", asesiData.tglDaftar);
  body.replaceText("{{SKEMA}}", asesiData.skema);
  body.replaceText("{{ALAMAT}}", asesiData.alamat);
  body.replaceText("{{PENDIDIKAN}}", asesiData.pendidikan);

  doc.saveAndClose();
  const pdfBlob = copyDoc.getAs('application/pdf');
  const pdfFile = DriveApp.getFolderById(FOLDER_OUTPUT_ID).createFile(pdfBlob);
  copyDoc.setTrashed(true);

  return pdfFile.getUrl();
}
