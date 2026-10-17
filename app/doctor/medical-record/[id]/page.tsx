"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  User,
  ShieldAlert,
  Sparkles,
  Calendar,
  Pill,
  Stethoscope,
} from "lucide-react";
import { initialQueues } from "@/lib/mockData";

const availableTreatments = [
  "Laser Q-Switched Nd:YAG",
  "Glowing Facial & Extraction",
  "Chemical Peeling TCA 10%",
  "Skin Booster Salmon DNA",
  "Botox Anti-Wrinkle Forehead",
  "Hydra Glow Infusion",
  "LED Light Therapy (Red & Blue)",
  "PRP (Platelet Rich Plasma)",
];

export default function MedicalRecordPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = (params?.id as string) || "Q-001";

  // Match patient info or default
  const patient = initialQueues.find((q) => q.id === patientId) || {
    id: patientId,
    queueNumber: "A-01",
    patientName: "Clarissa Aurelia",
    patientPhone: "0812-3456-7890",
    doctorName: "dr. Nadia Sp.KK",
    treatment: "Laser Rejuvenation & Glowing Facial",
    time: "09:00 WIB",
    status: "Konsultasi",
    room: "Ruang Estetika 1",
  };

  // Form State
  const [formData, setFormData] = useState({
    skinType: "Kombinasi (Cenderung Berminyak)",
    allergies: "Tidak ada riwayat alergi obat/kosmetik",
    complaints: "Kulit kusam di area T-zone, flek hitam ringan di pipi kanan setelah terpapar matahari.",
    diagnosis: "Melasma Epidermal Ringan + Post-Inflammatory Hyperpigmentation",
    selectedTreatments: ["Laser Q-Switched Nd:YAG", "Glowing Facial & Extraction"],
    prescriptions: "- Krim Pagi (Niacinamide 4% + Sunscreen SPF 50 PA++++)\n- Krim Malam (Retinol 0.5% + Centella Asiatica)\n- Facial Wash Gentle Chamomile",
    doctorNotes: "Hindari paparan sinar matahari langsung selama 3 hari. Gunakan tabir surya setiap 3 jam.",
    nextFollowUp: "2026-10-31",
  });

  // Validation & Backend Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Toggle treatment selection
  const handleToggleTreatment = (treatment: string) => {
    setFormData((prev) => {
      const exists = prev.selectedTreatments.includes(treatment);
      return {
        ...prev,
        selectedTreatments: exists
          ? prev.selectedTreatments.filter((t) => t !== treatment)
          : [...prev.selectedTreatments, treatment],
      };
    });
    if (errors.selectedTreatments) {
      setErrors((prev) => ({ ...prev, selectedTreatments: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.complaints.trim()) {
      newErrors.complaints = "Keluhan utama pasien wajib diisi.";
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis medis dokter wajib diisi.";
    }
    if (formData.selectedTreatments.length === 0) {
      newErrors.selectedTreatments = "Pilih minimal 1 tindakan estetika yang diberikan.";
    }
    if (!formData.prescriptions.trim()) {
      newErrors.prescriptions = "Resep produk/skincare klinik wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call to backend /api/medical-records
      const payload = {
        patientId,
        patientName: patient.patientName,
        doctor: patient.doctorName,
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      // Simulated network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Rekam medis berhasil disimpan ke backend:", payload);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      alert("Gagal menyimpan data ke backend. Silakan coba kembali.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#DB2777] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Dokter</span>
        </Link>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2C0C8]/30 text-[#DB2777] border border-[#E2C0C8]">
          Formulir Elektronik Rekam Medis (E-RM)
        </span>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Rekam Medis Berhasil Disimpan ke Sistem!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Data klinis pasien {patient.patientName} telah disinkronkan ke rekam medis pusat dan bagian kasir/farmasi klinik.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/doctor/dashboard")}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Selesai & Kembali
          </button>
        </div>
      )}

      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#DB2777] to-[#F472B6] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#DB2777]/30">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-900">{patient.patientName}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DB2777] text-white">
                No. {patient.queueNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              ID Pasien: <span className="font-semibold text-gray-700">{patient.id}</span> • Telp: {patient.patientPhone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8]">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Dokter Pemeriksa</span>
            <span className="font-bold text-gray-800">{patient.doctorName}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8]">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Ruang Tindakan</span>
            <span className="font-bold text-[#DB2777]">{patient.room}</span>
          </div>
        </div>
      </div>

      {/* Main Medical Record Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Anamnesis & Profil Kulit */}
        <div className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2C0C8]/60 text-gray-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#DB2777]" />
            <span>1. Anamnesis & Karakteristik Kulit Pasien</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tipe Kulit Pasien
              </label>
              <select
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
              >
                <option>Normal</option>
                <option>Kering (Dry Skin)</option>
                <option>Berminyak (Oily Skin)</option>
                <option>Kombinasi (Cenderung Berminyak)</option>
                <option>Sensitif & Atopik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Riwayat Alergi (Obat / Kosmetik)</span>
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="Contoh: Alergi Salicylic Acid / Debu"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Keluhan Utama Pasien <span className="text-[#DB2777]">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.complaints}
              onChange={(e) => {
                setFormData({ ...formData, complaints: e.target.value });
                if (errors.complaints) setErrors({ ...errors, complaints: "" });
              }}
              placeholder="Deskripsikan keluhan kulit yang dirasakan pasien..."
              className={`w-full p-3.5 text-xs rounded-xl bg-[#FFF9FA] border ${
                errors.complaints ? "border-rose-400 ring-1 ring-rose-300" : "border-[#E2C0C8]"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]`}
            />
            {errors.complaints && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.complaints}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Diagnosis & Tindakan Estetika */}
        <div className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2C0C8]/60 text-gray-900 font-bold text-sm">
            <Stethoscope className="w-4 h-4 text-[#DB2777]" />
            <span>2. Diagnosis Klinis & Tindakan Perawatan yang Diberikan</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Diagnosis Medis Dokter <span className="text-[#DB2777]">*</span>
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => {
                setFormData({ ...formData, diagnosis: e.target.value });
                if (errors.diagnosis) setErrors({ ...errors, diagnosis: "" });
              }}
              placeholder="Contoh: Acne Vulgaris Grade II + Hiperpigmentasi"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border ${
                errors.diagnosis ? "border-rose-400 ring-1 ring-rose-300" : "border-[#E2C0C8]"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]`}
            />
            {errors.diagnosis && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.diagnosis}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Pilihan Tindakan Estetika Hari Ini <span className="text-[#DB2777]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {availableTreatments.map((t) => {
                const isSelected = formData.selectedTreatments.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTreatment(t)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                      isSelected
                        ? "bg-[#DB2777] text-white border-[#DB2777] shadow-sm shadow-[#DB2777]/25"
                        : "bg-[#FFF9FA] text-gray-700 border-[#E2C0C8] hover:bg-[#E2C0C8]/30 hover:border-[#DB2777]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="line-clamp-2">{t}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 shrink-0 fill-white text-[#DB2777]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.selectedTreatments && (
              <p className="text-[11px] text-rose-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.selectedTreatments}
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Resep Skincare & Anjuran Dokter */}
        <div className="bg-white rounded-3xl border border-[#E2C0C8] p-6 shadow-[0_4px_20px_rgba(226,192,200,0.2)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2C0C8]/60 text-gray-900 font-bold text-sm">
            <Pill className="w-4 h-4 text-[#DB2777]" />
            <span>3. Resep Skincare / Obat & Anjuran Kontrol</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Resep Krim, Serum & Obat Pulang <span className="text-[#DB2777]">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.prescriptions}
                onChange={(e) => {
                  setFormData({ ...formData, prescriptions: e.target.value });
                  if (errors.prescriptions) setErrors({ ...errors, prescriptions: "" });
                }}
                placeholder="Tuliskan aturan pakai krim pagi, malam, atau obat minum..."
                className={`w-full p-3.5 text-xs rounded-xl bg-[#FFF9FA] border ${
                  errors.prescriptions ? "border-rose-400 ring-1 ring-rose-300" : "border-[#E2C0C8]"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777] font-mono`}
              />
              {errors.prescriptions && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.prescriptions}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Khusus Edukasi Pasien
                </label>
                <textarea
                  rows={2}
                  value={formData.doctorNotes}
                  onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                  placeholder="Pantangan pasca-laser, anjuran kompres es, dll."
                  className="w-full p-3 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#DB2777]" />
                  <span>Jadwal Kontrol Ulang Berikutnya</span>
                </label>
                <input
                  type="date"
                  value={formData.nextFollowUp}
                  onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/doctor/dashboard"
            className="px-5 py-2.5 rounded-xl border border-[#E2C0C8] text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#DB2777]/30 flex items-center gap-2 transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Rekam Medis & Selesaikan Sesi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
