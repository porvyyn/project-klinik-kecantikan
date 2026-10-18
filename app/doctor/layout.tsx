import React from "react";
import "@/app/globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FFF9FA]">
      <Sidebar role="doctor" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Panel Konsultasi & Rekam Medis Dokter"
          subtitle="dr. Nadia Putri, Sp.KK - Ruang Estetika 1"
          role="doctor"
        />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
