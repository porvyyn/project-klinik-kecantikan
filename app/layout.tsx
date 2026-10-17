import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlowAura Clinic - Sistem Dashboard Klinik Kecantikan & Rekam Medis",
  description:
    "Aplikasi manajemen dashboard klinik kecantikan terpadu untuk administrasi, jadwal praktik dokter, antrean pasien real-time, dan rekam medis elektronik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-[#FFF9FA] text-gray-800">
        {children}
      </body>
    </html>
  );
}
