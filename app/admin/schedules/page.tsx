"use client";

import React, { useState } from "react";
import { Plus, Check, Clock, Stethoscope, X, MapPin } from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";
import { initialSchedules, DoctorSchedule } from "@/lib/mockData";

const DAYS_OF_WEEK = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const formatDaysString = (days: string[]): string => {
  if (days.length === 0) return "";
  const sorted = [...days].sort(
    (a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)
  );

  const indices = sorted.map((d) => DAYS_OF_WEEK.indexOf(d));
  const isConsecutive = indices.every(
    (val, i, arr) => i === 0 || val === arr[i - 1] + 1
  );

  if (isConsecutive && sorted.length >= 3) {
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  } else if (sorted.length === 2) {
    return `${sorted[0]} & ${sorted[1]}`;
  }

  return sorted.join(", ");
};

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
  ]);

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

  const handleToggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    setFormData((prev) => ({
      ...prev,
      day: formatDaysString(newDays),
    }));
  };

  const handlePresetChange = (preset: string) => {
    if (!preset) return;
    let newDays: string[] = [];
    if (preset === "weekday") {
      newDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    } else if (preset === "senin-sabtu") {
      newDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    } else if (preset === "senin-kamis") {
      newDays = ["Senin", "Selasa", "Rabu", "Kamis"];
    } else if (preset === "weekend") {
      newDays = ["Sabtu", "Minggu"];
    } else if (preset === "all") {
      newDays = [...DAYS_OF_WEEK];
    } else if (DAYS_OF_WEEK.includes(preset)) {
      newDays = [preset];
    }
    setSelectedDays(newDays);
    setFormData((prev) => ({
      ...prev,
      day: formatDaysString(newDays),
    }));
  };

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
    if (!formData.doctorName.trim() || selectedDays.length === 0) return;

    const newSchedule: DoctorSchedule = {
      id: `SCH-${String(schedules.length + 1).padStart(2, "0")}`,
      doctorName: formData.doctorName,
      specialty: formData.specialty,
      day: formData.day || formatDaysString(selectedDays),
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      quota: Number(formData.quota),
      status: "Aktif",
    };

    setSchedules([newSchedule, ...schedules]);
    setIsModalOpen(false);
    setSelectedDays(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]);
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
      accessorKey: "day",
      cell: (item) => (
        <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">
          {item.day}
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
      header: "Ruang Poli",
      accessorKey: "room",
      cell: (item) => (
        <div className="inline-flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9FA] text-[#DB2777] font-semibold text-xs border border-[#E2C0C8] shadow-2xs whitespace-nowrap">
            <MapPin className="w-3 h-3 text-[#DB2777] shrink-0" />
            <span>{item.room}</span>
          </span>
        </div>
      ),
    },
    {
      header: "Kuota / Hari",
      accessorKey: "quota",
      cell: (item) => (
        <div className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="font-extrabold text-gray-900">{item.quota}</span>
          <span className="text-[11px] text-gray-500 font-medium">Pasien</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
            item.status === "Aktif"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.status === "Aktif" ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <span>{item.status}</span>
        </span>
      ),
    },
    {
      header: "Tindakan",
      cell: (item) => (
        <button
          onClick={() => handleToggleStatus(item.id)}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap ${
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
              </div>

              {/* Hari Praktik Multi-select Checkbox Group & Preset Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Hari Praktik
                  </label>
                  <span className="text-[11px] font-bold text-[#DB2777] bg-[#E2C0C8]/30 px-2.5 py-0.5 rounded-lg border border-[#E2C0C8]">
                    {formData.day || "Belum dipilih"}
                  </span>
                </div>

                {/* Dropdown Preset Hari Kerja */}
                <div className="mb-2">
                  <select
                    onChange={(e) => handlePresetChange(e.target.value)}
                    defaultValue=""
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                  >
                    <option value="">-- Pilih Template / Preset Hari --</option>
                    <option value="weekday">Senin - Jumat (Hari Kerja)</option>
                    <option value="senin-sabtu">Senin - Sabtu</option>
                    <option value="senin-kamis">Senin - Kamis</option>
                    <option value="weekend">Sabtu & Minggu (Akhir Pekan)</option>
                    <option value="all">Setiap Hari (Senin - Minggu)</option>
                    <optgroup label="Pilihan Hari Tunggal">
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>
                          Hanya {d}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Checkbox Group Hari (Senin - Minggu) */}
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isChecked = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`cursor-pointer py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all flex flex-col items-center justify-center select-none ${
                          isChecked
                            ? "bg-[#DB2777] text-white border-[#DB2777] shadow-sm shadow-[#DB2777]/25 scale-102"
                            : "bg-[#FFF9FA] text-gray-700 border-[#E2C0C8] hover:border-[#DB2777] hover:bg-[#E2C0C8]/20"
                        }`}
                      >
                        <span className="text-[11px] leading-tight">{day.slice(0, 3)}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-3 h-3 rounded accent-[#DB2777] pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedDays.length === 0 ? (
                  <p className="text-[11px] text-rose-500 font-medium mt-1.5">
                    * Wajib memilih minimal satu hari praktik dokter.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-500 mt-1.5">
                    Pilih preset atau centang hari di atas (Senin s/d Minggu) untuk hari praktik dokter.
                  </p>
                )}
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
