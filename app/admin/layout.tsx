import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FFF9FA]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Panel Administrasi Klinik"
          subtitle="Manajemen operasional harian, kuota dokter, dan pantauan antrean pasien"
          role="admin"
        />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
