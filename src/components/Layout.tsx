import React from "react";
import { User, UserRole } from "../types";
import { LogOut, Home, User as UserIcon, Settings, BarChart } from "lucide-react";

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export function Layout({ user, onLogout, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col md:flex-row font-sans text-[#1A1A1A]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white font-bold">
            LP
          </div>
          <span className="font-bold text-lg leading-tight">E-LSP TJP1</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Home size={20} />} label="Dashboard" active />
          {user.role === UserRole.ASESI && (
            <>
              <NavItem icon={<UserIcon size={20} />} label="Profil Saya" />
              <NavItem icon={<Settings size={20} />} label="Dokumen" />
            </>
          )}
          {user.role === UserRole.ADMIN && (
             <>
              <NavItem icon={<UserIcon size={20} />} label="Data Siswa" />
              <NavItem icon={<BarChart size={20} />} label="Verifikasi" />
            </>
          )}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon size={20} className="text-gray-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.nama}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col">
        {/* Header for Mobile/Mobile only logout for now */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                LP
              </div>
            <span className="font-bold">E-LSP TJP1</span>
          </div>
          <button onClick={onLogout} className="p-2 text-red-600 bg-red-50 rounded-lg">
             <LogOut size={20} />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
           {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-10">
        <button className="flex flex-col items-center gap-1 text-[#5A5A40]">
           <Home size={20} />
           <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
           <UserIcon size={20} />
           <span className="text-[10px] font-bold">Profil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
           <BarChart size={20} />
           <span className="text-[10px] font-bold">Status</span>
        </button>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active 
          ? "bg-[#5A5A40] text-white shadow-lg" 
          : "text-gray-500 hover:bg-gray-50 hover:text-[#5A5A40]"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
