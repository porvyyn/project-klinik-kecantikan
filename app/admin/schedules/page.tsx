"use client";

import React, { useState } from "react";
import { Plus, Check, Clock, Stethoscope, X } from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";
import { initialSchedules, DoctorSchedule } from "@/lib/mockData";

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new schedule
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "Aesthetic Doctor & Anti-Aging",
    day: "Senin - Jumat",
    startTime: "09:00",
    endTime: "16:00",
    room: "Ruang Estetika 1",
    quota: 15,
  });

  const handleToggleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Aktif" ? "Cuti" : "Aktif" }
          : s
      )
    );
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName.trim()) return;

    const newSchedule: DoctorSchedule = {
      id: `SCH-${String(schedules.length + 1).padStart(2, "0")}`,
      doctorName: formData.doctorName,
      specialty: formData.specialty,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      quota: Number(formData.quota),
      status: "Aktif",
    };

    setSchedules([newSchedule, ...schedules]);
    setIsModalOpen(false);
    setFormData({
      doctorName: "",
      specialty: "Aesthetic Doctor & Anti-Aging",
      day: "Senin - Jumat",
      startTime: "09:00",
      endTime: "16:00",
      room: "Ruang Estetika 1",
      quota: 15,
    });
  };

  const columns: Column<DoctorSchedule>[] = [
    {
      header: "Dokter & Spesialisasi",
      accessorKey: "doctorName",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-[#DB2777] flex items-center justify-center font-bold">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">{item.doctorName}</p>
            <p className="text-[11px] text-gray-500">{item.specialty}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Hari Praktik",
      accessorKey: "day",
      cell: (item) => (
        <span className="font-semibold text-gray-800 text-xs">{item.day}</span>
      ),
    },
    {
      header: "Jam Praktik",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-[#DB2777]" />
          <span>
            {item.startTime} - {item.endTime} WIB
          </span>
        </div>
      ),
    },
    {
      header: "Ruang Poli",
      accessorKey: "room",
      cell: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#E2C0C8]/25 text-[#DB2777] font-semibold text-[11px] border border-[#E2C0C8]">
          {item.room}
        </span>
      ),
    },
    {
      header: "Kuota / Hari",
      accessorKey: "quota",
      cell: (item) => (
        <span className="font-bold text-gray-800 text-xs">{item.quota} Pasien</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            item.status === "Aktif"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Tindakan",
      cell: (item) => (
        <button
          onClick={() => handleToggleStatus(item.id)}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
            item.status === "Aktif"
              ? "border-[#E2C0C8] text-gray-600 hover:bg-[#E2C0C8]/30 hover:text-[#DB2777]"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {item.status === "Aktif" ? "Set Cuti" : "Aktifkan"}
        </button>
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
            Atur shift, alokasi ruang poli kecantikan, dan batas kuota harian konsultasi dokter spesialis.
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
        searchPlaceholder="Cari dokter, spesialisasi, atau hari..."
        searchKey="doctorName"
        filterOptions={[
          { label: "Aktif", value: "Aktif", key: "status" },
          { label: "Cuti", value: "Cuti", key: "status" },
        ]}
        title="Daftar Jadwal Praktik Aktif"
        subtitle="Sinkronisasi otomatis dengan portal reservasi pasien"
      />

      {/* Modal Tambah Jadwal Dokter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2C0C8] shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2C0C8]">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Tambah Jadwal Praktik Dokter</h3>
                <p className="text-xs text-gray-500">Lengkapi data shift dan alokasi poli</p>
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
                  Nama Dokter & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="Contoh: dr. Amanda Vanya, Sp.DV"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Spesialisasi
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  >
                    <option>Spesialis Kulit & Kelamin (Sp.KK)</option>
                    <option>Aesthetic Doctor & Anti-Aging</option>
                    <option>Aesthetic Laser Specialist</option>
                    <option>Dermatologi & Venereologi (Sp.DVE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Hari Praktik
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    placeholder="Senin - Kamis"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  />
                </div>
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
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
                    max="50"
                    required
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ruang Poli / Tindakan
                </label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                >
                  <option>Ruang Estetika 1</option>
                  <option>Ruang Tindakan 2</option>
                  <option>Ruang Laser Pro</option>
                  <option>Ruang Konsultasi VIP</option>
                </select>
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
                  className="px-5 py-2 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white text-xs font-bold shadow-md shadow-[#DB2777]/30 flex items-center gap-1.5"
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
