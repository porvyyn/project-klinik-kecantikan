"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Check, Clock, Stethoscope, X } from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";
import { api } from "@/lib/api";

interface ScheduleItem {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  quotaLimit: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  schedules?: any[];
}

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new schedule
  const [formData, setFormData] = useState({
    doctorId: "",
    dayOfWeek: "1", // Default: 1 (Senin)
    startTime: "09:00",
    endTime: "16:00",
    quotaLimit: 15,
  });

  // Fetch doctors & combine all schedules
  const loadSchedules = useCallback(async () => {
    try {
      const doctorList = await api<Doctor[]>("/doctors");
      setDoctors(doctorList || []);

      const combinedSchedules: ScheduleItem[] = [];
      doctorList?.forEach((doc) => {
        if (Array.isArray(doc.schedules)) {
          doc.schedules.forEach((sch: any) => {
            combinedSchedules.push({
              id: sch.id,
              doctorId: doc.id,
              doctorName: doc.name,
              specialty: doc.specialty || "Dokter Spesialis",
              dayOfWeek: Number(sch.dayOfWeek),
              startTime: sch.startTime,
              endTime: sch.endTime,
              quotaLimit: Number(sch.quotaLimit ?? sch.quota ?? 0),
            });
          });
        }
      });

      setSchedules(combinedSchedules);
    } catch (e) {
      console.error("Gagal mengambil data jadwal & dokter:", e);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Set default doctorId when doctors list loads
  useEffect(() => {
    if (doctors.length > 0 && !formData.doctorId) {
      setFormData((prev) => ({ ...prev, doctorId: doctors[0].id }));
    }
  }, [doctors, formData.doctorId]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) return;

    try {
      await api("/schedules", {
        method: "POST",
        body: JSON.stringify({
          doctorId: formData.doctorId,
          dayOfWeek: Number(formData.dayOfWeek),
          startTime: formData.startTime,
          endTime: formData.endTime,
          quotaLimit: Number(formData.quotaLimit),
        }),
      });

      setIsModalOpen(false);
      await loadSchedules();

      // Reset form
      setFormData({
        doctorId: doctors[0]?.id || "",
        dayOfWeek: "1",
        startTime: "09:00",
        endTime: "16:00",
        quotaLimit: 15,
      });
    } catch (e) {
      console.error("Gagal menyimpan jadwal baru:", e);
    }
  };

  const columns: Column<ScheduleItem>[] = [
    {
      header: "Dokter & Spesialisasi",
      accessorKey: "doctorName",
      cell: (item) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-[#DB2777] flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-xs leading-snug">{item.doctorName}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{item.specialty}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Hari Praktik",
      accessorKey: "dayOfWeek",
      cell: (item) => (
        <span className="font-semibold text-gray-800 text-xs">
          {DAY_NAMES[item.dayOfWeek] ?? `Hari ${item.dayOfWeek}`}
        </span>
      ),
    },
    {
      header: "Jam Praktik",
      cell: (item) => (
        <div className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-medium whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#FFF9FA] border border-[#E2C0C8]/60">
          <Clock className="w-3.5 h-3.5 text-[#DB2777] shrink-0" />
          <span>
            {item.startTime} - {item.endTime} WIB
          </span>
        </div>
      ),
    },
    {
      header: "Kuota / Hari",
      accessorKey: "quotaLimit",
      cell: (item) => (
        <span className="font-bold text-gray-800 text-xs">
          {item.quotaLimit} Pasien
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Manajemen Jadwal Praktik Dokter
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Atur shift, jam praktik, dan batas kuota harian konsultasi dokter spesialis.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white font-bold text-xs shadow-md shadow-[#DB2777]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Dokter</span>
        </button>
      </div>

      {/* Interactive DataTable */}
      <DataTable
        data={schedules}
        columns={columns}
        searchPlaceholder="Cari nama dokter atau spesialisasi..."
        searchKey="doctorName"
        title="Daftar Jadwal Praktik Aktif"
        subtitle="Sinkronisasi otomatis dengan portal reservasi pasien"
      />

      {/* Modal Tambah Jadwal Dokter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2C0C8] shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2C0C8]">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Tambah Jadwal Praktik Dokter
                </h3>
                <p className="text-xs text-gray-500">
                  Pilih dokter dan atur shift serta kuota praktik
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Dokter
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                >
                  {doctors.length === 0 ? (
                    <option value="">Tidak ada data dokter</option>
                  ) : (
                    doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} {doc.specialty ? `(${doc.specialty})` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hari Praktik
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                >
                  {DAY_NAMES.map((dayName, idx) => (
                    <option key={idx} value={idx}>
                      {idx} - {dayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kuota Pasien
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.quotaLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quotaLimit: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2C0C8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2C0C8] text-gray-600 text-xs font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.doctorId}
                  className="px-5 py-2 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#DB2777]/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
