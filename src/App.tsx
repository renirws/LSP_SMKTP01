import React, { useState, useEffect } from "react";
import { UserRole, User, APL01Data, APL02Data } from "./types";
import { Layout } from "./components/Layout";
import { AsesiDashboard } from "./components/AsesiDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DirekturDashboard } from "./components/DirekturDashboard";
import { LogIn, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial Mock Data
  const [apl01List, setApl01List] = useState<APL01Data[]>([]);
  const [apl02List, setApl02List] = useState<APL02Data[]>([]);

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      email: `${role.toLowerCase()}@smktjp01.sch.id`,
      role: role,
      nama: role === UserRole.ASESI ? "Budi Siswanto" : role === UserRole.ADMIN ? "Admin LSP" : "Drs. H. Mulyadi (Direktur)"
    });
  };

  const handleLogout = () => setUser(null);

  if (loading) {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F0] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white">
              <LogIn size={40} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-2 font-sans">E-LSP SMK Tanjung Priok 1</h1>
          <p className="text-gray-500 text-center mb-8 font-sans">Silakan pilih akses anda</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin(UserRole.ASESI)}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#5A5A40] hover:bg-[#F5F5F0] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-white">
                  <UserCircle />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-[#1A1A1A]">Siswa / Asesi</span>
                  <span className="text-xs text-gray-500 italic">Pendaftaran & Penilaian Mandiri</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#5A5A40] hover:bg-[#F5F5F0] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-white">
                  <UserCircle />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-[#1A1A1A]">Admin LSP</span>
                  <span className="text-xs text-gray-500 italic">Verifikasi Data & Penjadwalan</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLogin(UserRole.DIREKTUR)}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#5A5A40] hover:bg-[#F5F5F0] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-white">
                  <UserCircle />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-[#1A1A1A]">Direktur LSP</span>
                  <span className="text-xs text-gray-500 italic">Dashboard Statistik & Laporan</span>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <AnimatePresence mode="wait">
        {user.role === UserRole.ASESI && (
          <AsesiDashboard 
            user={user} 
            apl01List={apl01List} 
            setApl01List={setApl01List}
            apl02List={apl02List}
            setApl02List={setApl02List}
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
