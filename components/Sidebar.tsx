"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users2,
  FileHeart,
  LogOut,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "doctor";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const adminNavItems: NavItem[] = [
    {
      title: "Dashboard Utama",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Jadwal Praktik",
      href: "/admin/schedules",
      icon: CalendarDays,
      badge: "4 Dokter",
    },
    {
      title: "Antrean Pasien",
      href: "/admin/queue",
      icon: Users2,
      badge: "5 Hari Ini",
    },
  ];

  const doctorNavItems: NavItem[] = [
    {
      title: "Dashboard Dokter",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Antrean Konsultasi",
      href: "/doctor/dashboard#antrean",
      icon: Clock,
      badge: "3 Menunggu",
    },
    {
      title: "Rekam Medis Pasien",
      href: "/doctor/medical-record/Q-001",
      icon: FileHeart,
      badge: "Aktif",
    },
  ];

  const navItems = role === "admin" ? adminNavItems : doctorNavItems;

  const handleLogout = () => {
    // Clear session or token in localStorage if any
    localStorage.removeItem("auth_role");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2C0C8] flex flex-col h-screen sticky top-0 select-none shadow-sm z-30">
      {/* Brand Logo & Header */}
      <div className="p-6 border-b border-[#E2C0C8]/60 bg-gradient-to-b from-[#FFF9FA] to-white">
        <Link href={role === "admin" ? "/admin/dashboard" : "/doctor/dashboard"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#DB2777] flex items-center justify-center text-white shadow-md shadow-[#DB2777]/30 transition-transform group-hover:scale-105 duration-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-gray-900 block leading-tight">
              Vel<span className="text-[#DB2777]">oura</span>
            </span>
            <span className="text-xs text-[#DB2777] font-semibold tracking-wide uppercase">
              Beauty Clinic & Spa
            </span>
          </div>
        </Link>

        {/* Current Role Badge */}
        <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-lg bg-[#E2C0C8]/25 border border-[#E2C0C8]">
          <div className="flex items-center gap-2">
            {role === "admin" ? (
              <ShieldCheck className="w-4 h-4 text-[#DB2777]" />
            ) : (
              <Stethoscope className="w-4 h-4 text-[#DB2777]" />
            )}
            <span className="text-xs font-semibold text-gray-700 capitalize">
              Panel {role === "admin" ? "Administrator" : "Dokter Praktek"}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Menu Navigasi
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes("#") && pathname.startsWith(item.href.split("#")[0]));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                isActive
                  ? "bg-[#DB2777] text-white shadow-md shadow-[#DB2777]/25 font-semibold"
                  : "text-gray-600 hover:bg-[#E2C0C8]/30 hover:text-[#DB2777]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#DB2777]"
                  )}
                />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E2C0C8]/40 text-[#DB2777]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout in Footer */}
      <div className="p-4 border-t border-[#E2C0C8]/60 bg-gradient-to-t from-[#FFF9FA] to-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E2C0C8] text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-medium text-sm transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
