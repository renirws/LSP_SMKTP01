import React, { useState } from "react";
import { User, APL01Data } from "../types";
import { motion } from "motion/react";
import { Save, X, FileText, Fingerprint } from "lucide-react";
import { SCHEME_NAME } from "../constants";

interface APL01FormProps {
  user: User;
  onSave: (data: APL01Data) => void;
  onClose: () => void;
}

export function APL01Form({ user, onSave, onClose }: APL01FormProps) {
  const [formData, setFormData] = useState<Partial<APL01Data>>({
    namaLengkap: user.nama,
    skemaPilihan: SCHEME_NAME,
    statusVerifikasi: "MENUNGGU"
  });

  const isFormValid = 
    formData.namaLengkap && 
    formData.nik?.length === 16 && 
    formData.tempatLahir && 
    formData.tglLahir && 
    formData.alamat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const fullData: APL01Data = {
      ...formData as APL01Data,
      idReg: "REG-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id
    };
    onSave(fullData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F5F5F0]">
          <div>
            <h3 className="text-xl font-bold font-sans">Formulir APL-01</h3>
            <p className="text-xs text-gray-500 font-medium tracking-tight">PENDAFTARAN SERTIFIKASI KOMPETENSI</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Nama Lengkap (Sesuai Ijazah/KTP)" 
              value={formData.namaLengkap} 
              onChange={(v) => setFormData({...formData, namaLengkap: v})}
              required
            />
            <InputField 
              label="NIK (16 Digit)" 
              value={formData.nik} 
              onChange={(v) => setFormData({...formData, nik: v})}
              maxLength={16}
              required
            />
            <InputField 
              label="Tempat Lahir" 
              value={formData.tempatLahir} 
              onChange={(v) => setFormData({...formData, tempatLahir: v})}
              required
            />
            <InputField 
              label="Tanggal Lahir" 
              type="date"
              value={formData.tglLahir} 
              onChange={(v) => setFormData({...formData, tglLahir: v})}
              required
            />
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Alamat Domisili</label>
              <textarea 
                rows={3}
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <InputField 
                label="Skema Sertifikasi" 
                value={formData.skemaPilihan} 
                disabled
              />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4">
             <Fingerprint className="text-yellow-600 shrink-0" size={24} />
             <div className="text-xs text-yellow-800 leading-relaxed italic">
               Dengan menekan kirim, saya menyatakan bahwa data yang saya berikan adalah benar dan dapat dipertanggungjawabkan sesuai hukum yang berlaku di Indonesia.
             </div>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold shadow-xl shadow-[#5A5A40]/30 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Simpan Dokumen & Kirim
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", disabled = false, maxLength, required = false }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">{label}</label>
      <input 
        type={type}
        value={value || ""}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] disabled:opacity-50"
      />
    </div>
  );
}
