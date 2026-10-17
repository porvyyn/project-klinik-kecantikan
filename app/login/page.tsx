"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Stethoscope, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "doctor">("admin");
  const [email, setEmail] = useState("admin@glowaura.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: "admin" | "doctor") => {
    setRole(newRole);
    setError(null);
    if (newRole === "admin") {
      setEmail("admin@glowaura.com");
      setPassword("password123");
    } else {
      setEmail("dr.nadia@glowaura.com");
      setPassword("dokter123");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Silakan lengkapi email dan kata sandi Anda.");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("auth_role", role);
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/doctor/dashboard");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FA] via-[#FDF2F4] to-[#F8EEF0] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#DB2777]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E2C0C8]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2C0C8] shadow-[0_10px_40px_rgba(219,39,119,0.12)] p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DB2777] text-white shadow-lg shadow-[#DB2777]/30 mb-3 transition-transform hover:scale-105 duration-200">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Glow<span className="text-[#DB2777]">Aura</span> Clinic
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Sistem Informasi Manajemen Klinik Kecantikan & Rekam Medis
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
            Pilih Role
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF9FA] rounded-2xl border border-[#E2C0C8]">
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${role === "admin"
                ? "bg-[#DB2777] text-white shadow-md shadow-[#DB2777]/25"
                : "text-gray-600 hover:bg-[#E2C0C8]/30 hover:text-[#DB2777]"
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("doctor")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${role === "doctor"
                ? "bg-[#DB2777] text-white shadow-md shadow-[#DB2777]/25"
                : "text-gray-600 hover:bg-[#E2C0C8]/30 hover:text-[#DB2777]"
                }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Dokter Praktik</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Akses
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@glowaura.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777] transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-[#E2C0C8] text-[#DB2777] focus:ring-[#DB2777]"
              />
              <span>Ingat saya di sesi ini</span>
            </label>
            <a href="#" className="text-[#DB2777] hover:underline font-semibold">
              Lupa sandi?
            </a>
          </div>

          {/* Submit Button with #DB2777 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#DB2777]/30 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk sebagai {role === "admin" ? "Admin" : "Dokter"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Testing Notice */}
        <div className="mt-6 pt-4 border-t border-[#E2C0C8]/60 text-center">
          <p className="text-[11px] text-gray-500">
            Akses Demo siap pakai: kredensial otomatis terisi saat memilih role di atas.
          </p>
        </div>
      </div>
    </div>
  );
}
