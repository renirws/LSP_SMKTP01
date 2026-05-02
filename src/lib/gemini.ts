import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function screenPortfolio(imageBase64: string, unitId: string, unitTitle: string) {
  const prompt = `
    Anda adalah Asesor Digital LSP SMK Tanjung Priok 1.
    Tugas Anda adalah memvalidasi bukti portofolio untuk unit kompetensi: ${unitId} - ${unitTitle}.

    Aturan Validasi:
    - Unit M.74100.001.02 (Prinsip Dasar): Bukti harus berupa pemahaman elemen desain (titik, garis, warna).
    - Unit M.74100.005.02 (Software): Bukti harus berupa screenshot/file hasil olah software (Photoshop/Illustrator/CorelDRAW). Harus terlihat interface software desain.
    - Unit M.74100.009.02 (Karya Desain): Bukti harus berupa hasil karya final (Poster/Logo/Layout).

    Analisis gambar yang diberikan dan tentukan apakah bukti tersebut VALID atau TIDAK VALID.
    Berikan alasan singkat dalam Bahasa Indonesia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(",")[1] || imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["VALID", "NON_VALID"] },
            note: { type: Type.STRING }
          },
          required: ["status", "note"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as { status: "VALID" | "NON_VALID"; note: string };
  } catch (error) {
    console.error("AI Screening Error:", error);
    return { status: "NON_VALID", note: "Gagal terhubung ke sistem AI." };
  }
}
