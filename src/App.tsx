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
  const loadBusinessData = async () => {
    setLoading(true);
    try {
      const apl01Data = await sheetService.read("Data_APL01");
      const apl02Data = await sheetService.read("Data_APL02");
      
      setApl01List(apl01Data.map((d: any) => ({
        idReg: d.ID_APL01,
        userId: d.UserID,
        namaLengkap: d.Nama_Lengkap || "Asesi",
        nik: d.NISN_NIK || d.NIK,
        tempatLahir: d.Tempat_Lahir || "-",
        tglLahir: d.Tgl_Daftar,
        alamat: d.Alamat || "-",
        skemaPilihan: d.Nama_Skema || "-",
        statusVerifikasi: d.Status_Verifikasi_Admin || "MENUNGGU"
      })));
    } catch (err) {
      console.error("Gagal memuat data bisnis:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Just simple warm-up or check if we have a session
    setInitialLoading(false);
  }, []);

  const handleLogin = async (username: string, pass: string) => {
    setLoading(true);
    setLoginError(null);
    try {
      const usersRaw = await sheetService.read("User_Auth");
      const foundUser = usersRaw.find((u: any) => 
        u.Username.toString() === username && u.Password_Hash.toString() === pass
      );

      if (foundUser) {
        if (foundUser.Status_Aktif === "FALSE" || foundUser.Status_Aktif === false) {
          setLoginError("Akun Anda sedang dinonaktifkan oleh Direktur.");
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: foundUser.UserID,
          username: foundUser.Username,
          email: `${foundUser.Username.toLowerCase()}@smktjp01.sch.id`,
          role: foundUser.Role as UserRole,
          nama: foundUser.Nama_Lengkap
        };

        setUser(newUser);
        await loadBusinessData();
      } else {
        setLoginError("Kredensial salah. Periksa Username & Password.");
      }
    } catch (err) {
      setLoginError("Gangguan koneksi ke Database SMK TJP 1.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setApl01List([]);
    setApl02List([]);
  };

  const syncApl01 = async (data: APL01Data) => {
    await sheetService.create("Data_APL01", {
      ID_APL01: data.idReg,
      UserID: data.userId,
      No_Registrasi: data.idReg,
      Tgl_Daftar: new Date().toISOString(),
      Nama_Skema: data.skemaPilihan,
      Alamat: data.alamat,
      Status_Verifikasi_Admin: data.statusVerifikasi,
      NISN_NIK: data.nik
    });
    setApl01List(prev => [...prev, data]);
  };

  const syncApl02 = async (data: APL02Data) => {
    // In real app, we would loop through assessments. Here we simplify for a single record or first unit
    for (const unit of data.assessments) {
      await sheetService.create("Data_APL02", {
        ID_APL02: `ASM-${unit.unitId}-${data.idReg}`,
        ID_APL01: data.idReg,
        Kode_Unit: unit.unitId,
        Status_K_BK: unit.isCompetent ? "K" : "BK",
        Bukti_Relevan_Link: unit.evidenceLink,
        Rekomendasi_Asesor: "VALIDASI-AI"
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
