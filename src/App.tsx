import React, { useState, useEffect } from "react";
import { UserRole, User, APL01Data, APL02Data } from "./types";
import { Layout } from "./components/Layout";
import { AsesiDashboard } from "./components/AsesiDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DirekturDashboard } from "./components/DirekturDashboard";
import { LoginForm } from "./components/LoginForm";
import { LogIn, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sheetService } from "./services/sheetService";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [apl01List, setApl01List] = useState<APL01Data[]>([]);
  const [apl02List, setApl02List] = useState<APL02Data[]>([]);

  // Function to load business data after login
  const loadBusinessData = async (users?: any[]) => {
    setLoading(true);
    try {
      const usersData = users || await sheetService.read("User_Auth");
      const apl01Data = await sheetService.read("Data_APL01");
      const apl02Data = await sheetService.read("Data_APL02");
      
      const mappedApl01 = apl01Data.map((d: any) => {
        const owner = usersData.find((u: any) => u.UserID === d.UserID);
        return {
          idReg: d.ID_APL01,
          userId: d.UserID,
          namaLengkap: owner ? owner.Nama_Lengkap : "Unknown",
          nik: owner ? owner.NISN_NIK : "-",
          tempatLahir: "-", // Not in APL01 schema requested
          tglLahir: d.Tgl_Daftar,
          alamat: d.Alamat || "-",
          skemaPilihan: d.Nama_Skema || "-",
          statusVerifikasi: d.Status_Verifikasi_Admin || "MENUNGGU"
        };
      });

      setApl01List(mappedApl01);
      // Mapping APL02 would go here if needed in state
    } catch (err) {
      console.error("Gagal memuat data bisnis:", err);
    }
    setLoading(false);
  };

  const handleLogin = async (username: string, pass: string) => {
    setLoading(true);
    setLoginError(null);
    try {
      const usersRaw = await sheetService.read("User_Auth");
      
      if (!usersRaw || usersRaw.length === 0) {
        setLoginError("Database User kosong atau API tidak merespon.");
        setLoading(false);
        return;
      }

      const foundUser = usersRaw.find((u: any) => {
        const keys = Object.keys(u);
        const userKey = keys.find(k => k.toLowerCase().includes('username'));
        const passKey = keys.find(k => k.toLowerCase().includes('password_hash'));
        
        if (!userKey || !passKey) return false;

        const uName = (u[userKey] || "").toString().trim().toLowerCase();
        const uPass = (u[passKey] || "").toString().trim();
        
        return uName === username.trim().toLowerCase() && uPass === pass.trim();
      });

      if (foundUser) {
        const keys = Object.keys(foundUser);
        const statusKey = keys.find(k => k.toLowerCase().includes('status'));
        const isInactive = statusKey && ["false", "non-aktif", "nonaktif", "off"].includes(foundUser[statusKey]?.toString().toLowerCase());

        if (isInactive) {
          setLoginError("Akun Anda telah dinonaktifkan.");
          setLoading(false);
          return;
        }

        setUser({
          id: foundUser.UserID || foundUser.id || "UID",
          username: username.toLowerCase(),
          email: username.toLowerCase() === "admin_lsp" ? "widyastutireni29@gmail.com" : `${username.toLowerCase()}@guru.smk.belajar.id`,
          role: (foundUser.Role || foundUser.role || "ASESI").toString().toUpperCase() as UserRole,
          nama: foundUser.Nama_Lengkap || foundUser.nama || username
        });
        await loadBusinessData(usersRaw);
      } else {
        setLoginError("Akses ditolak. Cek Username/Password atau pastikan data di Google Sheet sudah benar.");
        console.warn("User tidak ditemukan di sheet User_Auth. Data yang terbaca:", usersRaw);
      }
    } catch (err: any) {
      console.error("Critical Login Error:", err);
      if (err.message === "FAILED_TO_FETCH" || err.message?.toLowerCase().includes("fetch")) {
        setLoginError(
          "Koneksi Gagal (Failed to Fetch).\n\n" 
        );
      } else if (err.message === "AUTH_REQUIRED_BY_GOOGLE") {
        setLoginError("Akses Terkunci. Apps Script meminta Login Google. Pastikan setelan 'Who has access' adalah 'Anyone'.");
      } else if (err.message === "URL_NOT_FOUND") {
        setLoginError("URL tidak ditemukan (404). Periksa kembali link Apps Script Anda di Secrets.");
      } else {
        setLoginError("Terjadi kesalahan sistem (" + (err.message || "Unknown") + "). Silakan hubungi: widyastutireni29@gmail.com");
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setApl01List([]);
    setApl02List([]);
  };

  useEffect(() => {
    // Just simple warm-up
    setInitialLoading(false);
  }, []);

  const syncApl01 = async (data: APL01Data) => {
    await sheetService.create("Data_APL01", {
      ID_APL01: data.idReg,
      UserID: data.userId,
      No_Registrasi: data.idReg,
      Tgl_Daftar: new Date().toISOString(),
      Nama_Skema: data.skemaPilihan,
      Alamat: data.alamat,
      Pendidikan: "SMK (Siswa Aktif)",
      Status_Verifikasi_Admin: data.statusVerifikasi,
      Tanda_Tangan_Asesi: data.ttdDigital || "SIGNED_DIGITALLY"
    });
    setApl01List(prev => [...prev, data]);
  };

  const syncApl02 = async (data: APL02Data) => {
    for (const unit of data.assessments) {
      await sheetService.create("Data_APL02", {
        ID_APL02: `ASM-${Math.random().toString(36).substr(2, 5)}`,
        ID_APL01: data.idReg,
        Kode_Unit: unit.unitId,
        Judul_Unit: "Unit Kompetensi " + unit.unitId,
        Status_K_BK: unit.isCompetent ? "K" : "BK",
        Bukti_Relevan_Link: unit.evidenceLink,
        Rekomendasi_Asesor: unit.aiVerificationStatus === "VALID" ? "Direkomendasikan (AI Validated)" : "Belum Direkomendasikan",
        Tanda_Tangan_Asesor: "SYSTEM_AI"
      });
    }
    setApl02List(prev => [...prev, data]);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        error={loginError} 
        loading={loading} 
      />
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <AnimatePresence mode="wait">
        {user.role === UserRole.ASESI && (
          <AsesiDashboard 
            user={user} 
            apl01List={apl01List} 
            setApl01List={syncApl01 as any} 
            apl02List={apl02List}
            setApl02List={syncApl02 as any}
          />
        )}
        {user.role === UserRole.ADMIN && (
          <AdminDashboard 
            user={user} 
            apl01List={apl01List}
            setApl01List={setApl01List}
          />
        )}
        {user.role === UserRole.DIREKTUR && (
          <DirekturDashboard 
            user={user} 
            apl01List={apl01List}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
