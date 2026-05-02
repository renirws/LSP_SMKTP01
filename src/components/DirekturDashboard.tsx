import React from "react";
import { User, APL01Data } from "../types";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Download, PieChart as PieIcon, Award, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface DirekturDashboardProps {
  user: User;
  apl01List: APL01Data[];
}

export function DirekturDashboard({ user, apl01List }: DirekturDashboardProps) {
  const data = [
    { name: "Diterima", val: apl01List.filter(a => a.statusVerifikasi === "DITERIMA").length, color: "#10b981" },
    { name: "Menunggu", val: apl01List.filter(a => a.statusVerifikasi === "MENUNGGU").length + 2, color: "#f59e0b" }, // Mock data to show chart
    { name: "Perbaikan", val: apl01List.filter(a => a.statusVerifikasi === "PERBAIKAN").length, color: "#3b82f6" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight">Executive Dashboard</h2>
          <p className="text-gray-500 mt-1">Laporan Strategis LSP SMK Tanjung Priok 1</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-[#1A1A1A]/20 transition-all">
           <Download size={18} />
           Export PDF (BNSP Report)
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard 
          title="Tingkat Kelulusan" 
          value="84.2%" 
          trend="+5.3%" 
          icon={<Award size={24} />} 
          subtitle="Target Semester: 90%"
        />
        <OverviewCard 
          title="Efisiensi Verifikasi" 
          value="1.2 Hari" 
          trend="-0.4" 
          icon={<TrendingUp size={24} />} 
          subtitle="Avg. Respon Admin"
        />
        <OverviewCard 
          title="Data Tidak Valid" 
          value="12 Kasus" 
          trend="+2" 
          icon={<ShieldAlert size={24} />} 
          subtitle="Portofolio Terdeteksi AI"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <PieIcon size={20} className="text-[#5A5A40]" />
              Status Sertifikasi (Semester Genap)
           </h3>
           <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                 />
                <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Action Needed */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-[#5A5A40]" />
              Approval Petinggi (Menunggu)
           </h3>
           {apl01List.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <FileText size={32} />
                  </div>
                  <p className="text-sm font-medium italic">Tidak ada antrian persetujuan.</p>
              </div>
           ) : (
             <div className="space-y-4">
               {apl01List.map(a => (
                 <div key={a.idReg} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                       <p className="font-bold text-sm">{a.namaLengkap}</p>
                       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{a.skemaPilihan}</p>
                    </div>
                    <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold shadow-md">
                       Approve
                    </button>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function OverviewCard({ title, value, trend, icon, subtitle }: { title: string; value: string; trend: string; icon: React.ReactNode; subtitle: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5A5A40]/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-[#F5F5F0] text-[#5A5A40] rounded-2xl flex items-center justify-center">
           {icon}
        </div>
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{value}</p>
        <p className="text-[11px] text-gray-400 mt-2 font-medium italic">{subtitle}</p>
      </div>
    </div>
  );
}

import { FileText } from "lucide-react";
