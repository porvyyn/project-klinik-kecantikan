"use client";

import React from "react";
import Link from "next/link";
import {
  Users2,
  Clock,
  CheckCircle2,
  FileHeart,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { initialQueues } from "@/lib/mockData";

export default function DoctorDashboardPage() {
  // Filter queue for dr. Nadia
  const doctorQueues = initialQueues.filter((q) => q.doctorName.includes("Nadia"));
  const activePatient = doctorQueues.find((q) => q.status === "Konsultasi") || doctorQueues[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Current Patient Alert / Consultation in Progress Card */}
      {activePatient && (
        <div className="bg-white rounded-3xl border-2 border-[#DB2777] p-6 shadow-[0_8px_30px_rgba(219,39,119,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#DB2777] text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-bl-2xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Pasien Dalam Ruang Tindakan</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#DB2777] text-white flex flex-col items-center justify-center font-black shadow-md shadow-[#DB2777]/30 shrink-0">
                <span className="text-[10px] uppercase font-semibold text-white/80">Antrean</span>
                <span className="text-lg leading-tight">{activePatient.queueNumber}</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  {activePatient.patientName}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2C0C8]/40 text-[#DB2777] border border-[#E2C0C8]">
                    {activePatient.room}
                  </span>
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">
                  Rencana Tindakan: <span className="text-[#DB2777] font-bold">{activePatient.treatment}</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Kontak: {activePatient.patientPhone} • Jam Masuk: {activePatient.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/doctor/medical-record/${activePatient.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white font-bold text-xs shadow-md shadow-[#DB2777]/30 transition-all hover:scale-102"
              >
                <FileHeart className="w-4 h-4" />
                <span>Buka / Input Rekam Medis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Pasien Hari Ini (dr. Nadia)"
          value={`${doctorQueues.length} Pasien`}
          icon={Users2}
          subtitle="Total kuota: 15 pasien"
        />
        <StatCard
          title="Menunggu Konsultasi"
          value={`${doctorQueues.filter((q) => q.status === "Menunggu").length} Pasien`}
          icon={Clock}
          subtitle="Estimasi waktu tunggu ~15 mnt"
        />
        <StatCard
          title="Tindakan Selesai"
          value={`${doctorQueues.filter((q) => q.status === "Selesai").length} Pasien`}
          isPositive={true}
          change="+100%"
          icon={CheckCircle2}
          subtitle="Rekam medis telah terbit"
        />
      </div>

      {/* Doctor's Today Queue Table */}
      <div id="antrean" className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2C0C8]/60">
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Daftar Antrean Pasien dr. Nadia Putri, Sp.KK
            </h3>
            <p className="text-xs text-gray-500">
              Pilih pasien untuk mengisi atau memperbarui catatan rekam medis estetika
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2C0C8]/30 text-[#DB2777] border border-[#E2C0C8]">
            Ruang Estetika 1
          </span>
        </div>

        <div className="mt-4 divide-y divide-[#E2C0C8]/40">
          {doctorQueues.map((item) => (
            <div
              key={item.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFF9FA] rounded-xl px-3 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-[#DB2777] flex flex-col items-center justify-center font-bold text-xs shadow-xs">
                  <span className="text-[9px] text-gray-400 uppercase">No.</span>
                  <span>{item.queueNumber}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.patientName}</h4>
                  <p className="text-xs text-gray-600 font-medium">{item.treatment}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Waktu: {item.time} • Telp: {item.patientPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    item.status === "Konsultasi"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : item.status === "Menunggu"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  }`}
                >
                  {item.status}
                </span>

                <Link
                  href={`/doctor/medical-record/${item.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Input E-RM</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
