import React, { useState } from "react";
import { User, APL01Data, APL02Data, UserRole } from "../types";
import { motion } from "motion/react";
import { ClipboardCheck, FileText, Send, CheckCircle, Clock, AlertCircle, Upload, Award } from "lucide-react";
import { COMPETENCE_UNITS, SCHEME_NAME } from "../constants";
import { APL01Form } from "./APL01Form";
import { APL02Form } from "./APL02Form";

interface AsesiDashboardProps {
  user: User;
  apl01List: APL01Data[];
  setApl01List: React.Dispatch<React.SetStateAction<APL01Data[]>>;
  apl02List: APL02Data[];
  setApl02List: React.Dispatch<React.SetStateAction<APL02Data[]>>;
}

export function AsesiDashboard({ user, apl01List, setApl01List, apl02List, setApl02List }: AsesiDashboardProps) {
  const [showAPL01, setShowAPL01] = useState(false);
  const [showAPL02, setShowAPL02] = useState(false);

  const currentAPL01 = apl01List.find(a => a.userId === user.id);
  const currentAPL02 = apl02List.find(a => a.idReg === currentAPL01?.idReg);

  const handleSaveAPL01 = (data: APL01Data) => {
    setApl01List(prev => [...prev, data]);
    setShowAPL01(false);
  };

  const handleSaveAPL02 = (data: APL02Data) => {
    setApl02List(prev => [...prev, data]);
    setShowAPL02(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="mb-8 p-8 bg-white rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm overflow-hidden relative group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#5A5A40]/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mb-3 inline-block font-sans">Dashboard Asesi v1.0</span>
          <h2 className="text-3xl font-bold font-sans tracking-tight">Halo, {user.nama}</h2>
          <p className="text-gray-500 mt-1 font-medium italic">Skema: {SCHEME_NAME}</p>
        </div>
        <div className="flex gap-4 relative z-10">
           {currentAPL01?.statusVerifikasi === "DITERIMA" && currentAPL02 && (
             <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
               <Award className="text-green-600" size={32} />
               <div>
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Status Akhir</p>
                  <p className="font-bold text-green-800">Kompeten (Rekomendasi AI)</p>
               </div>
             </div>
           )}
        </div>
      </header>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText size={28} />
             </div>
             {currentAPL01 ? (
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                  currentAPL01.statusVerifikasi === "DITERIMA" ? 'bg-green-50 text-green-600' : 
                  currentAPL01.statusVerifikasi === "PERBAIKAN" ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                   {currentAPL01.statusVerifikasi === "MENUNGGU" && <Clock size={14} />}
                   {currentAPL01.statusVerifikasi === "DITERIMA" && <CheckCircle size={14} />}
                   {currentAPL01.statusVerifikasi === "PERBAIKAN" && <AlertCircle size={14} />}
                   {currentAPL01.statusVerifikasi}
                </div>
             ) : (
                <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-xs font-bold rounded-full">Belum Diisi</span>
             )}
          </div>
          <h3 className="font-bold text-xl mb-2">Formulir APL-01</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">Lengkapi biodata dan scan dokumen asli (Rapor/Sertifikat/KTP) sesuai standar BNSP.</p>
          <button 
            disabled={!!currentAPL01 && currentAPL01.statusVerifikasi !== "PERBAIKAN"}
            onClick={() => setShowAPL01(true)}
            className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold shadow-xl shadow-[#5A5A40]/30 hover:shadow-[#5A5A40]/50 transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
          >
            {currentAPL01 ? (currentAPL01.statusVerifikasi === "PERBAIKAN" ? "Revisi Dokumen" : "Dokumen Terkunci") : "Mulai Pendaftaran"}
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardCheck size={28} />
             </div>
             {currentAPL02 ? (
                <span className="px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-2">
                   <CheckCircle size={14} /> Selesai
                </span>
             ) : (
                <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-xs font-bold rounded-full">Terkunci</span>
             )}
          </div>
          <h3 className="font-bold text-xl mb-2">Penilaian Mandiri (APL-02)</h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">Klaim kompetensi Anda dan unggah bukti portofolio untuk divalidasi oleh sistem AI.</p>
          <button 
             disabled={!currentAPL01 || currentAPL01.statusVerifikasi !== "DITERIMA" || !!currentAPL02}
             onClick={() => setShowAPL02(true)}
             className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold shadow-xl shadow-[#5A5A40]/30 hover:shadow-[#5A5A40]/50 transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
          >
            {currentAPL02 ? "Asesmen Terkirim" : currentAPL01?.statusVerifikasi === "DITERIMA" ? "Isi Penilaian Mandiri" : "Tunggu Verifikasi APL-01"}
          </button>
        </div>
      </div>

      {/* Modern Horizontal Feed for Activity */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 items-center">
         <div className="md:w-1/3">
            <h3 className="font-bold text-xl flex items-center gap-2">
                <Clock size={20} className="text-[#5A5A40]" />
                Langkah Berikutnya
            </h3>
            <p className="text-sm text-gray-500 mt-2 italic leading-relaxed">
               Ikuti alur pendaftaran secara berurutan agar validasi data berjalan lancar.
            </p>
         </div>
         <div className="md:w-2/3 flex flex-wrap gap-4">
            <NextStepBadge number="01" label="Isi APL-01" active={!currentAPL01} />
            <NextStepBadge number="02" label="Verifikasi Admin" active={currentAPL01?.statusVerifikasi === "MENUNGGU"} />
            <NextStepBadge number="03" label="Penilaian Mandiri" active={currentAPL01?.statusVerifikasi === "DITERIMA" && !currentAPL02} />
            <NextStepBadge number="04" label="Sertifikat" active={!!currentAPL02} />
         </div>
      </div>

      {/* Modals */}
      {showAPL01 && (
        <APL01Form 
          user={user} 
          onSave={handleSaveAPL01} 
          onClose={() => setShowAPL01(false)} 
        />
      )}

      {showAPL02 && currentAPL01 && (
        <APL02Form 
          user={user} 
          apl01={currentAPL01} 
          onSave={handleSaveAPL02} 
          onClose={() => setShowAPL02(false)} 
        />
      )}
    </motion.div>
  );
}

function NextStepBadge({ number, label, active = false }: { number: string; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${active ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-lg scale-105' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
       <span className="text-[10px] font-bold font-mono">{number}</span>
       <span className="text-sm font-bold truncate">{label}</span>
    </div>
  );
}
