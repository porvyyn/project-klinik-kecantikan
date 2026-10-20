"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users2,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";

interface QueueItem {
  id: string;
  queueNumber: string | number;
  patientName: string;
  treatment: string;
  doctorName: string;
  room: string;
  status: string;
  time: string;
}

interface DoctorItem {
  id: string;
  name: string;
  specialty?: string;
  schedules?: any[];
}

export default function AdminDashboardPage() {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);

  // Fetch real-time queue & doctors data
  const loadDashboardData = useCallback(async () => {
    try {
      const [queueData, doctorList] = await Promise.all([
        api<any>("/appointments/live-queue").catch(() => null),
        api<DoctorItem[]>("/doctors").catch(() => []),
      ]);

      if (queueData?.queueList) {
        setQueues(
          queueData.queueList.map((a: any) => ({
            id: a.id,
            queueNumber: a.queueNumber,
            patientName: a.patientName,
            treatment: a.consultationType,
            doctorName: a.doctorName,
            room: a.roomNumber || "-",
            status:
              a.status === "In_Consultation"
                ? "Konsultasi"
                : a.status === "Completed"
                ? "Selesai"
                : a.status === "Cancelled"
                ? "Batal"
                : "Menunggu",
            time: a.scheduleTime || "-",
          }))
        );
      }

      if (Array.isArray(doctorList)) {
        setDoctors(doctorList);
      }
    } catch (e) {
      console.error("Gagal mengambil data dashboard:", e);
    }
  }, []);

  // Poll data every 10 seconds
  useEffect(() => {
    loadDashboardData();
    const t = setInterval(loadDashboardData, 10000);
    return () => clearInterval(t);
  }, [loadDashboardData]);

  // Derived counts from real-time API data
  const totalPasien = queues.length;
  const waitingCount = queues.filter((q) => q.status === "Menunggu").length;
  const inConsultCount = queues.filter((q) => q.status === "Konsultasi").length;
  const completedCount = queues.filter((q) => q.status === "Selesai").length;
  const doctorCount = doctors.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DB2777] via-[#E11D48] to-[#F43F5E] p-8 text-white shadow-xl shadow-[#DB2777]/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Operasional Klinik Berjalan Optimal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Portal Utama Veloura
          </h2>
          <p className="mt-2 text-white/90 text-sm leading-relaxed">
            Kelola operasional klinik kecantikan Anda dengan mudah. Pantau antrean secara real-time, atur rotasi jadwal dokter, dan pastikan pasien mendapatkan pengalaman perawatan estetika terbaik.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/queue"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#DB2777] font-bold text-xs hover:bg-[#FFF9FA] shadow-xs transition-all"
            >
              <span>Pantau Antrean Hari Ini</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/schedules"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs transition-all border border-white/30"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Atur Jadwal Dokter</span>
            </Link>
          </div>
        </div>

        {/* Ambient background shape */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Pasien Hari Ini"
          value={`${totalPasien} Pasien`}
          change="+14.2%"
          isPositive={true}
          icon={Users2}
          subtitle="Booking & Walk-in"
        />
        <StatCard
          title="Antrean Menunggu"
          value={`${waitingCount} Pasien`}
          icon={Clock}
          subtitle={`${inConsultCount} sedang konsultasi`}
        />
        <StatCard
          title="Dokter Terdaftar"
          value={`${doctorCount} Dokter`}
          icon={CalendarDays}
          subtitle="Aktif bertugas"
        />
        <StatCard
          title="Tindakan Selesai"
          value={`${completedCount} Pasien`}
          change="+8.5%"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Tingkat kepuasan 98%"
        />
      </div>

      {/* Main Grid: Live Queue & Today's Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Quick Queue Monitoring */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2C0C8]/60">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Antrean Pasien Terkini</h3>
              <p className="text-xs text-gray-500">Pembaruan otomatis dari loket pendaftaran</p>
            </div>
            <Link
              href="/admin/queue"
              className="text-xs font-bold text-[#DB2777] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua ({queues.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#E2C0C8]/40">
            {queues.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">
                Belum ada antrean pasien untuk hari ini.
              </p>
            ) : (
              queues.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="py-3.5 flex items-center justify-between hover:bg-[#E2C0C8]/10 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-[#DB2777] flex items-center justify-center font-extrabold text-xs shadow-xs">
                      {q.queueNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{q.patientName}</h4>
                      <p className="text-[11px] text-gray-500">{q.treatment}</p>
                      <p className="text-[10px] text-[#DB2777] font-semibold">
                        {q.doctorName} • {q.room}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        q.status === "Konsultasi"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : q.status === "Menunggu"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : q.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {q.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{q.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 span): Active Doctors & Quick Action */}
        <div className="space-y-6">
          {/* Active Doctors List */}
          <div className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2C0C8]/60">
              <h3 className="font-bold text-gray-900 text-base">Dokter Bertugas</h3>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {doctors.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400">
                  Tidak ada data dokter.
                </p>
              ) : (
                doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-2xl bg-[#FFF9FA] border border-[#E2C0C8] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{doc.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {doc.specialty || "Dokter Spesialis"}
                      </p>
                      <p className="text-[10px] text-[#DB2777] font-semibold mt-0.5">
                        {doc.schedules && doc.schedules.length > 0
                          ? `${doc.schedules.length} Jadwal Praktik`
                          : "Belum Ada Jadwal"}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Aktif
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-[#FFF9FA] to-[#FDF2F4] rounded-3xl border border-[#E2C0C8] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
              Aksi Cepat Admin
            </h4>
            <div className="space-y-2">
              <Link
                href="/admin/schedules"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2C0C8] text-xs font-semibold text-gray-800 hover:border-[#DB2777] hover:text-[#DB2777] transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#DB2777]" />
                  <span>Tambah Jadwal Dokter</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/queue"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2C0C8] text-xs font-semibold text-gray-800 hover:border-[#DB2777] hover:text-[#DB2777] transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DB2777]" />
                  <span>Kelola Antrean Pasien</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}