import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error?: string | null;
  loading: boolean;
}

export function LoginForm({ onLogin, error, loading }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F0] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5A5A40] to-[#8C8C60]" />
        
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#5A5A40] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-[#5A5A40]/30 transform -rotate-6">
            <ShieldCheck size={40} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-sans">E-LSP TJP 1</h1>
          <p className="text-gray-500 text-sm mt-1 italic">Sistem Keamanan Terintegrasi BNSP</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold shadow-xl shadow-[#5A5A40]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Masuk ke Sistem"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400 italic">
          &copy; 2024 LSP SMK Tanjung Priok 1. <br/> Hak Cipta Dilindungi.
        </p>
      </motion.div>
    </div>
  );
}
