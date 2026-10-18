"use client";

import React, { useState } from "react";
import { Volume2, Play, CheckCircle, Clock, Sparkles } from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";
import { initialQueues, QueueItem } from "@/lib/mockData";

// Chime notification sound using browser Web Audio API
const playChimeSound = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Tone 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2: 880.00 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.22);
      gain2.gain.setValueAtTime(0.25, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.75);

      setTimeout(() => {
        resolve();
      }, 700);
    } catch {
      resolve();
    }
  });
};

// Speech announcement using Web Speech API (speechSynthesis)
const speakAnnouncement = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;

  // Prefer Indonesian voice if available in browser
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(
    (v) => v.lang.startsWith("id") || v.lang.includes("ID")
  );
  if (idVoice) {
    utterance.voice = idVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export default function AdminQueuePage() {
  const [queues, setQueues] = useState<QueueItem[]>(initialQueues);
  const [activeCallMessage, setActiveCallMessage] = useState<string | null>(null);
  const [callingId, setCallingId] = useState<string | null>(null);

  // Status updates
  const handleUpdateStatus = (id: string, newStatus: QueueItem["status"]) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  // Announce / Call patient with Chime & Speech Synthesis
  const handleCallPatient = async (queue: QueueItem) => {
    const announcementText = `Nomor antrean ${queue.queueNumber}, ${queue.patientName} dipersilakan menuju ${queue.room}`;
    setActiveCallMessage(announcementText);
    setCallingId(queue.id);

    // 1. Putar efek nada lonceng klinik (Web Audio API)
    await playChimeSound();

    // 2. Bacakan panggilan suara otomatis (Web Speech API)
    speakAnnouncement(announcementText);

    setTimeout(() => {
      setActiveCallMessage(null);
      setCallingId(null);
    }, 5500);
  };

  const columns: Column<QueueItem>[] = [
    {
      header: "No. Antrean",
      accessorKey: "queueNumber",
      cell: (item) => (
        <div className="w-12 h-10 rounded-xl bg-gradient-to-br from-[#DB2777] to-[#F472B6] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
          {item.queueNumber}
        </div>
      ),
    },
    {
      header: "Pasien",
      accessorKey: "patientName",
      cell: (item) => (
        <div>
          <p className="font-bold text-gray-900 text-xs">{item.patientName}</p>
          <p className="text-[11px] text-gray-500">{item.patientPhone}</p>
        </div>
      ),
    },
    {
      header: "Perawatan & Dokter",
      cell: (item) => (
        <div>
          <p className="font-semibold text-gray-800 text-xs">{item.treatment}</p>
          <p className="text-[11px] text-[#DB2777] font-medium">{item.doctorName} • {item.room}</p>
        </div>
      ),
    },
    {
      header: "Waktu Kedatangan",
      accessorKey: "time",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{item.time}</span>
        </div>
      ),
    },
    {
      header: "Status Antrean",
      accessorKey: "status",
      cell: (item) => (
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
      ),
    },
    {
      header: "Aksi Antrean",
      cell: (item) => (
        <div className="flex items-center gap-2">
          {/* Panggil dengan audio pengeras suara */}
          <button
            onClick={() => handleCallPatient(item)}
            title="Panggil Pasien Melalui Pengeras Suara"
            className={`p-1.5 rounded-lg border transition-all ${
              callingId === item.id
                ? "bg-[#DB2777] text-white border-[#DB2777] shadow-md shadow-[#DB2777]/30 scale-105"
                : "border-[#E2C0C8] text-[#DB2777] hover:bg-[#E2C0C8]/30"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${callingId === item.id ? "animate-pulse text-white" : ""}`} />
          </button>

          {/* Quick status actions */}
          {item.status === "Menunggu" && (
            <button
              onClick={() => handleUpdateStatus(item.id, "Konsultasi")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DB2777] hover:bg-[#BE185D] text-white text-[11px] font-bold shadow-xs transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Mulai</span>
            </button>
          )}

          {item.status === "Konsultasi" && (
            <button
              onClick={() => handleUpdateStatus(item.id, "Selesai")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Selesai</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert when calling patient */}
      {activeCallMessage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#DB2777] to-[#BE185D] text-white shadow-xl flex items-center justify-between border border-pink-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-pink-200">
                Panggilan Suara Pengeras Suara
              </p>
              <span className="font-bold text-sm tracking-tight">{activeCallMessage}</span>
            </div>
          </div>
          <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            Audio Aktif
          </span>
        </div>
      )}

      {/* Header and Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Pemantauan Antrean Pasien Harian
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pantau status antrean pasien secara real-time dan kelola giliran tindakan dokter klinik.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            Menunggu: {queues.filter((q) => q.status === "Menunggu").length}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            Konsultasi: {queues.filter((q) => q.status === "Konsultasi").length}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            Selesai: {queues.filter((q) => q.status === "Selesai").length}
          </div>
        </div>
      </div>

      {/* DataTable Antrean */}
      <DataTable
        data={queues}
        columns={columns}
        searchPlaceholder="Cari nomor antrean, nama pasien, atau layanan..."
        searchKey="patientName"
        filterOptions={[
          { label: "Menunggu", value: "Menunggu", key: "status" },
          { label: "Konsultasi", value: "Konsultasi", key: "status" },
          { label: "Selesai", value: "Selesai", key: "status" },
        ]}
        title="Antrean Hari Ini (Real-Time)"
        subtitle="Data terhubung langsung dengan monitor ruang tunggu klinik"
      />
    </div>
  );
}
