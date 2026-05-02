import React, { useState } from "react";
import { User, APL02Data, APL01Data } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Upload, Sparkles, Loader2, Info, Send } from "lucide-react";
import { COMPETENCE_UNITS } from "../constants";
import { screenPortfolio } from "../lib/gemini";

interface APL02FormProps {
  user: User;
  apl01: APL01Data;
  onSave: (data: APL02Data) => void;
  onClose: () => void;
}

export function APL02Form({ user, apl01, onSave, onClose }: APL02FormProps) {
  const [assessments, setAssessments] = useState(
    COMPETENCE_UNITS.map(unit => ({
      unitId: unit.id,
      isCompetent: false,
      evidenceLink: "",
      aiVerificationStatus: "PENDING" as any,
      aiNote: ""
    }))
  );

  const [loadingUnit, setLoadingUnit] = useState<string | null>(null);

  const handleFileUpload = async (unitId: string, unitTitle: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingUnit(unitId);
    
    // Simulate File to Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      
      // Call Gemini for Screening
      const aiResult = await screenPortfolio(base64, unitId, unitTitle);
      
      setAssessments(prev => prev.map(a => a.unitId === unitId ? {
        ...a,
        evidenceLink: base64, // In real app, this would be a URL to cloud storage
        aiVerificationStatus: aiResult.status,
        aiNote: aiResult.note,
        isCompetent: aiResult.status === "VALID"
      } : a));
      
      setLoadingUnit(null);
    };
    reader.readAsDataURL(file);
  };

  const isAllValid = assessments.every(a => a.aiVerificationStatus === "VALID");

  const handleSubmit = () => {
    onSave({
      idAsesmen: "ASM-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      idReg: apl01.idReg,
      assessments
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20"
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#F5F5F0] to-white">
          <div>
            <h3 className="text-2xl font-bold font-sans">Penilaian Mandiri (APL-02)</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Sertifikasi Junior Operator Desain Grafis</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white shadow-sm border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
           <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                 <Info size={20} />
              </div>
              <p className="text-sm text-blue-900 leading-relaxed italic">
                 Silakan pilih "Kompeten" (K) jika Anda merasa menguasai unit tersebut, dan unggah bukti pendukung (Screenshot Software/Hasil Karya). Sistem AI akan memvalidasi bukti Anda secara otomatis.
              </p>
           </div>

           {COMPETENCE_UNITS.map((unit, index) => {
             const assessment = assessments.find(a => a.unitId === unit.id)!;
             const isAiValid = assessment.aiVerificationStatus === "VALID";
             const isAiInvalid = assessment.aiVerificationStatus === "NON_VALID";

             return (
               <div key={unit.id} className={`p-6 rounded-3xl border-2 transition-all ${
                 loadingUnit === unit.id ? 'border-[#5A5A40]/50 bg-[#F5F5F0]/50 animate-pulse' :
                 isAiValid ? 'border-green-200 bg-green-50/20' : 
                 isAiInvalid ? 'border-red-100 bg-red-50/20' : 
                 'border-gray-100 bg-white'
               }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                       <span className="text-[10px] font-bold text-gray-400 font-mono mb-1 block">{unit.id}</span>
                       <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">{unit.title}</h4>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setAssessments(prev => prev.map(a => a.unitId === unit.id ? {...a, isCompetent: true} : a))}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${assessment.isCompetent ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 text-gray-400'}`}
                       >
                         K
                       </button>
                       <button 
                         onClick={() => setAssessments(prev => prev.map(a => a.unitId === unit.id ? {...a, isCompetent: false} : a))}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${!assessment.isCompetent ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 text-gray-400'}`}
                       >
                         BK
                       </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <label className="flex-1 cursor-pointer">
                         <div className={`p-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 transition-all ${assessment.evidenceLink ? 'border-green-300 bg-white' : 'border-gray-200 hover:border-[#5A5A40]'}`}>
                            {loadingUnit === unit.id ? (
                               <div className="flex flex-col items-center gap-3 w-full py-1">
                                  <div className="flex items-center gap-3 text-[#5A5A40]">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="text-sm font-bold italic">AI sedang validasi portofolio...</span>
                                  </div>
                                  <div className="w-full max-w-xs bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ x: "-100%" }}
                                      animate={{ x: "100%" }}
                                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                      className="w-1/2 h-full bg-[#5A5A40] rounded-full"
                                    />
                                  </div>
                               </div>
                            ) : assessment.evidenceLink ? (
                               <div className="flex items-center gap-2 text-green-600">
                                  <Check size={20} />
                                  <span className="text-sm font-bold">Bukti Terunggah</span>
                               </div>
                            ) : (
                               <div className="flex items-center gap-2 text-gray-400">
                                  <Upload size={20} />
                                  <span className="text-sm font-bold italic">Upload Portofolio</span>
                               </div>
                            )}
                         </div>
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={(e) => handleFileUpload(unit.id, unit.title, e)}
                           disabled={loadingUnit !== null}
                         />
                       </label>
                    </div>

                    <AnimatePresence>
                      {assessment.aiNote && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`p-4 rounded-2xl flex gap-3 text-xs font-medium italic ${isAiValid ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}
                        >
                          <Sparkles size={16} className={isAiValid ? 'text-green-500' : 'text-red-400'} />
                          <div>
                            <span className="font-bold block mb-0.5">Auto-Screening AI:</span>
                            {assessment.aiNote}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
             )
           })}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-[1.25rem] font-bold"
           >
             Tutup
           </button>
           <button 
             disabled={!isAllValid}
             onClick={handleSubmit}
             className="flex-[2] py-4 bg-[#5A5A40] text-white rounded-[1.25rem] font-bold shadow-xl shadow-[#5A5A40]/30 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
           >
             <Send size={18} />
             Kirim Asesmen Mandiri
           </button>
        </div>
      </motion.div>
    </div>
  );
}
