"use client";

import React from "react";
import { Bell, MapPin, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  role: "admin" | "doctor";
}

export function Header({ title, subtitle, role }: HeaderProps) {
  const userName = role === "admin" ? "Siti Sarah (Admin Head)" : "dr. Nadia Putri, Sp.KK";
  const userInitial = role === "admin" ? "SS" : "NP";

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#E2C0C8]/70 px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(226,192,200,0.15)]">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Branch indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E2C0C8]/25 border border-[#E2C0C8] text-xs font-medium text-gray-700">
          <MapPin className="w-3.5 h-3.5 text-[#DB2777]" />
          <span>Cabang Senopati, Jaksel</span>
        </div>

        {/* Search quick button */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pasien / dokter..."
            className="pl-9 pr-4 py-2 w-56 text-xs rounded-full bg-[#FFF9FA] border border-[#E2C0C8] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777] transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-full bg-[#FFF9FA] border border-[#E2C0C8] hover:bg-[#E2C0C8]/30 transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4 text-gray-700" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#DB2777] ring-2 ring-white" />
        </button>

        {/* Profile Chip */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E2C0C8]/70">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DB2777] to-[#F472B6] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#E2C0C8]">
            {userInitial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">{userName}</p>
            <p className="text-[11px] font-medium text-[#DB2777] capitalize">
              {role === "admin" ? "Super Admin" : "Dokter Dermatologi"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
