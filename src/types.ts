export enum UserRole {
  ASESI = "ASESI",
  ADMIN = "ADMIN",
  DIREKTUR = "DIREKTUR"
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
  nama: string;
  foto?: string;
};

export type APL01Data = {
  idReg: string;
  userId: string;
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tglLahir: string;
  alamat: string;
  skemaPilihan: string;
  syaratScanLink: string;
  statusVerifikasi: "MENUNGGU" | "DITERIMA" | "DITOLAK" | "PERBAIKAN";
  catatanAdmin?: string;
  ttdDigital?: string;
};

export type CompetenceUnit = {
  id: string;
  title: string;
  evidence: string;
};

export type APL02Data = {
  idAsesmen: string;
  idReg: string;
  assessments: {
    unitId: string;
    isCompetent: boolean;
    evidenceLink: string;
    aiVerificationStatus?: "VALID" | "NON_VALID" | "PENDING";
    aiNote?: string;
  }[];
  rekomendasiAsesor?: string;
};
