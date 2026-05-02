import React, { useState } from "react";
import { User, APL01Data, UserRole } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Users, FileCheck, Calendar, PieChart, Search, Filter, Clock, CheckCircle, AlertCircle, X, ShieldCheck } from "lucide-react";
import { PermissionGate } from "./ui/PermissionGate";
import { hasPermission } from "../lib/permissions";

interface AdminDashboardProps {
  user: User;
  apl01List: APL01Data[];
  setApl01List: React.Dispatch<React.SetStateAction<APL01Data[]>>;
}

export function AdminDashboard({ user, apl01List, setApl01List }: AdminDashboardProps) {
  const [selectedApl, setSelectedApl] = useState<APL01Data | null>(null);

  const handleUpdateStatus = (idReg: string, status: APL01Data["statusVerifikasi"], note?: string) => {
    setApl01List(prev => prev.map(a => a.idReg === idReg ? { ...a, statusVerifikasi: status, catatanAdmin: note } : a));
    setSelectedApl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
       <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight">Manajemen LSP</h2>
          <p className="text-gray-500 mt-1">Sesi Aktif: {user.nama} (Admin Utama)</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">
             <Calendar size={18} />
             Jadwal Uji
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40] text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90">
             <FileCheck size={18} />
             Verifikasi Massal
           </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Asesi" value={apl01List.length.toString()} icon={<Users />} color="blue" />
        <StatCard title="Menunggu" value={apl01List.filter(a => a.statusVerifikasi === "MENUNGGU").length.toString()} icon={<Clock size={20} />} color="yellow" />
        <StatCard title="Diterima" value={apl01List.filter(a => a.statusVerifikasi === "DITERIMA").length.toString()} icon={<CheckCircle size={20} />} color="green" />
        <StatCard title="Butuh Perbaikan" value={apl01List.filter(a => a.statusVerifikasi === "PERBAIKAN").length.toString()} icon={<AlertCircle size={20} />} color="red" />
      </div>

      {/* Data Table Area */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-lg">Daftar Pengajuan Sertifikasi (APL-01)</h3>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari NIK atau Nama..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] md:w-64"
                />
             </div>
             <button className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
               <Filter size={18} />
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Asesi</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Skema</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {apl01List.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic font-medium">
                      Tidak ada data pendaftaran saat ini.
                   </td>
                </tr>
              ) : (
                apl01List.map((apl) => (
                  <tr key={apl.idReg} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1A1A1A]">{apl.namaLengkap}</div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{apl.idReg}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{apl.nik}</td>
                    <td className="px-6 py-4">
                       <span className="bg-[#F5F5F0] px-2 py-1 rounded text-[10px] font-bold text-[#5A5A40]">
                          {apl.skemaPilihan}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apl.statusVerifikasi} />
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedApl(apl)}
                        className="px-4 py-1.5 bg-gray-100 text-[#5A5A40] text-xs font-bold rounded-lg hover:bg-[#5A5A40] hover:text-white transition-all"
                      >
                        Periksa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApl && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-[#F5F5F0] border-b border-gray-100 flex items-center justify-between">
                 <h3 className="font-bold text-lg">Detail Verifikasi Asesi</h3>
                 <button onClick={() => setSelectedApl(null)}><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <DetailRow label="Nama Lengkap" value={selectedApl.namaLengkap} />
                    <DetailRow label="NIK" value={selectedApl.nik} />
                    <DetailRow label="Tempat/Tgl Lahir" value={`${selectedApl.tempatLahir}, ${selectedApl.tglLahir}`} />
                    <DetailRow label="Alamat" value={selectedApl.alamat} />
                 </div>

                 <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <PermissionGate role={user.role} permission="verify_apl01">
                      <button 
                        onClick={() => handleUpdateStatus(selectedApl.idReg, "DITERIMA")}
                        className="py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={18} />
                        Terima (Valid)
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedApl.idReg, "PERBAIKAN")}
                        className="py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        <AlertCircle size={18} />
                        Minta Perbaikan
                      </button>
                    </PermissionGate>
                    {user.role === UserRole.DIREKTUR && !hasPermission(user.role, "verify_apl01") && (
                      <div className="col-span-2 text-center text-xs text-gray-400 italic">
                        Mode View-Only (Direktur tidak memiliki akses verifikasi teknis)
                      </div>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
       <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1 text-[#1A1A1A] tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    MENUNGGU: "bg-yellow-50 text-yellow-600",
    DITERIMA: "bg-green-50 text-green-600",
    DITOLAK: "bg-red-50 text-red-600",
    PERBAIKAN: "bg-blue-50 text-blue-600",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}
