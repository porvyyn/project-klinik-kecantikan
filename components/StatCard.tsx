import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2C0C8] shadow-[0_4px_16px_rgba(226,192,200,0.25)] hover:shadow-[0_8px_24px_rgba(219,39,119,0.12)] transition-all duration-300 relative overflow-hidden group">
      {/* Decorative soft pink gradient shape */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#E2C0C8]/20 rounded-bl-full pointer-events-none group-hover:bg-[#E2C0C8]/30 transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#FFF9FA] border border-[#E2C0C8] text-[#DB2777] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#DB2777] group-hover:text-white transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="mt-4 pt-3 border-t border-[#E2C0C8]/50 flex items-center gap-2 text-xs">
          <span
            className={cn(
              "font-bold px-2 py-0.5 rounded-full text-[11px]",
              isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            )}
          >
            {change}
          </span>
          <span className="text-gray-400">vs minggu lalu</span>
        </div>
      )}
    </div>
  );
}
