"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  MapPin,
  Search,
  CheckCheck,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  role: "admin" | "doctor";
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "queue" | "schedule" | "alert" | "system";
  isRead: boolean;
}

const initialAdminNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Pasien Baru Menunggu",
    description: "Clarissa Aurelia telah hadir untuk Laser Rejuvenation di Ruang Estetika 1.",
    time: "5 menit yang lalu",
    type: "queue",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Pembaruan Jadwal Praktik",
    description: "dr. Gisella Anastasia, Sp.DVE mengajukan cuti untuk sesi konsultasi besok.",
    time: "25 menit yang lalu",
    type: "schedule",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Peringatan Stok Produk",
    description: "Serum Skin Booster Salmon DNA tersisa 3 vial di lemari farmasi klinik.",
    time: "1 jam yang lalu",
    type: "alert",
    isRead: false,
  },
  {
    id: "notif-4",
    title: "Sinkronisasi Rekam Medis",
    description: "Seluruh data antrean harian dan transaksi kasir telah disinkronkan aman ke sistem.",
    time: "2 jam yang lalu",
    type: "system",
    isRead: true,
  },
];

const initialDoctorNotifications: NotificationItem[] = [
  {
    id: "notif-d1",
    title: "Giliran Tindakan Pasien",
    description: "Pasien antrean A-01 (Clarissa Aurelia) siap dipanggil ke Ruang Estetika 1.",
    time: "3 menit yang lalu",
    type: "queue",
    isRead: false,
  },
  {
    id: "notif-d2",
    title: "Konsultasi Baru Dikonfirmasi",
    description: "Amanda Putri telah masuk daftar antrean Botox Anti-Aging pukul 10:15 WIB.",
    time: "15 menit yang lalu",
    type: "schedule",
    isRead: false,
  },
  {
    id: "notif-d3",
    title: "Pembaruan Rekam Medis",
    description: "Riwayat alergi Jessica Melinda telah diperbarui sebelum prosedur Hydra Glow.",
    time: "45 menit yang lalu",
    type: "alert",
    isRead: true,
  },
];

export function Header({ title, subtitle, role }: HeaderProps) {
  const userName = role === "admin" ? "Siti Sarah (Admin Head)" : "dr. Nadia Putri, Sp.KK";
  const userInitial = role === "admin" ? "SS" : "NP";

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    role === "admin" ? initialAdminNotifications : initialDoctorNotifications
  );
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "queue":
        return <Users className="w-4 h-4 text-[#DB2777]" />;
      case "schedule":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "system":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

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

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className={`relative p-2.5 rounded-full border transition-all ${
              isNotificationOpen
                ? "bg-[#DB2777] text-white border-[#DB2777] shadow-md shadow-[#DB2777]/25"
                : "bg-[#FFF9FA] border-[#E2C0C8] hover:bg-[#E2C0C8]/30 text-gray-700"
            }`}
            title="Buka Notifikasi & Pesan Pemberitahuan"
            aria-label="Notifikasi"
            aria-expanded={isNotificationOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ${
                  isNotificationOpen
                    ? "bg-white ring-[#DB2777]"
                    : "bg-[#DB2777] ring-white animate-pulse"
                }`}
              />
            )}
          </button>

          {/* Notification Popover Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-[#E2C0C8] shadow-[0_12px_40px_rgba(219,39,119,0.18)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Panel Header */}
              <div className="p-4 bg-gradient-to-r from-[#FFF9FA] to-white border-b border-[#E2C0C8]/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#DB2777]/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">Notifikasi Klinik</h3>
                    <p className="text-[10px] text-gray-500">Pemberitahuan operasional terkini</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DB2777] hover:bg-[#E2C0C8]/30 px-2 py-1 rounded-lg transition-colors"
                      title="Tandai semua sudah dibaca"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Baca Semua</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2C0C8]/40">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleToggleRead(notif.id)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-[#FFF9FA] transition-colors cursor-pointer group ${
                        !notif.isRead ? "bg-[#FFF9FA]/60" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E2C0C8] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-xs truncate ${
                              !notif.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#DB2777] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-[#DB2777] mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-gray-700">Tidak ada notifikasi baru</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Semua aktivitas operasional klinik telah Anda tinjau.
                    </p>
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-3 bg-[#FFF9FA] border-t border-[#E2C0C8]/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-time Sync</span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-[11px] font-semibold text-gray-500 hover:text-rose-600 transition-colors"
                  >
                    Kosongkan Riwayat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Chip */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E2C0C8]/70">
          <div className="w-10 h-10 rounded-full aspect-square shrink-0 bg-gradient-to-tr from-[#DB2777] to-[#F472B6] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#E2C0C8]">
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
