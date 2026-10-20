"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users2,
  Clock,
  CheckCircle2,
  FileHeart,
  ArrowRight,
  Sparkles,
  FileText,
  Play,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface QueueItem {
  id: string;
  queueNumber: string | number;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  treatment: string;
  time: string;
  room: string;
  status: string;
}

export default function DoctorDashboardPage() {
  const [queues, setQueues] = useState<QueueItem[]>([]);

  // Fetch queue data filtered by logged-in doctor
  const loadDoctorQueue = useCallback(async () => {
    try {
      const user = getUser();
      const doctorId = user?.doctorId;
      const endpoint = doctorId
        ? `/appointments/live-queue?doctorId=${doctorId}`
        : "/appointments/live-queue";

      const data = await api<any>(endpoint);
      if (data?.queueList) {
        setQueues(
          data.queueList.map((a: any) => ({
            id: a.id,
            queueNumber: a.queueNumber,
            patientName: a.patientName,
            patientPhone: a.patientPhoneNumber || "-",
            doctorName: a.doctorName,
            treatment: a.consultationType,
            time: a.scheduleTime || "-",
            room: a.roomNumber || "Ruang Konsultasi",
            status:
              a.status === "In_Consultation"
                ? "Konsultasi"
                : a.status === "Completed"
                ? "Selesai"
                : a.status === "Cancelled"
                ? "Batal"
                : "Menunggu",
          }))
        );
      }
    } catch (e) {
      console.error("Gagal mengambil antrean dokter:", e);
    }
  }, []);

  // Poll data every 10 seconds
  useEffect(() => {
    loadDoctorQueue();
    const t = setInterval(loadDoctorQueue, 10000);
    return () => clearInterval(t);
  }, [loadDoctorQueue]);

  // Handler to change status to In_Consultation
  const handleStartConsultation = async (id: string) => {
    try {
      await api(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "In_Consultation" }),
      });
      await loadDoctorQueue();
    } catch (e) {
      console.error("Gagal memulai konsultasi:", e);
    }
  };

  const activePatient = queues.find((q) => q.status === "Konsultasi");

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
          title="Pasien Hari Ini"
          value={`${queues.length} Pasien`}
          icon={Users2}
          subtitle="Total antrean terdaftar"
        />
        <StatCard
          title="Menunggu Konsultasi"
          value={`${queues.filter((q) => q.status === "Menunggu").length} Pasien`}
          icon={Clock}
          subtitle="Siap dipanggil ke ruang tindakan"
        />
        <StatCard
          title="Tindakan Selesai"
          value={`${queues.filter((q) => q.status === "Selesai").length} Pasien`}
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
              Daftar Antrean Pasien Dokter
            </h3>
            <p className="text-xs text-gray-500">
              Pilih pasien untuk memulai konsultasi atau memperbarui catatan rekam medis estetika
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2C0C8]/30 text-[#DB2777] border border-[#E2C0C8]">
            {activePatient?.room || "Ruang Konsultasi"}
          </span>
        </div>

        <div className="mt-4 divide-y divide-[#E2C0C8]/40">
          {queues.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">
              Belum ada jadwal antrean pasien hari ini.
            </p>
          ) : (
            queues.map((item) => (
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
                        : item.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* Tombol Mulai Konsultasi jika Menunggu */}
                  {item.status === "Menunggu" && (
                    <button
                      onClick={() => handleStartConsultation(item.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Mulai Konsultasi</span>
                    </button>
                  )}

                  {/* Link Input E-RM hanya jika status Konsultasi */}
                  {item.status === "Konsultasi" && (
                    <Link
                      href={`/doctor/medical-record/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Input E-RM</span>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}