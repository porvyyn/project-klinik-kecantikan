"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  filterOptions?: { label: string; value: string; key: keyof T }[];
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Cari data...",
  searchKey,
  filterOptions,
  title,
  subtitle,
  actionButton,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search matching
      let matchesSearch = true;
      if (searchTerm.trim() !== "") {
        if (searchKey) {
          const val = String(item[searchKey] || "").toLowerCase();
          matchesSearch = val.includes(searchTerm.toLowerCase());
        } else {
          matchesSearch = Object.values(item).some((v) =>
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }

      // Filter option matching
      let matchesFilter = true;
      if (selectedFilter !== "all" && filterOptions) {
        const activeOption = filterOptions.find((f) => f.value === selectedFilter);
        if (activeOption) {
          matchesFilter = String(item[activeOption.key]) === activeOption.value;
        }
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, selectedFilter, searchKey, filterOptions]);

  return (
    <div className="bg-white rounded-2xl border border-[#E2C0C8] shadow-[0_4px_20px_rgba(226,192,200,0.25)] overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-[#E2C0C8]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFF9FA] via-white to-[#FDF2F4]">
        <div>
          {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E2C0C8] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB2777]/30 focus:border-[#DB2777] transition-all"
            />
          </div>

          {/* Filter Pills */}
          {filterOptions && filterOptions.length > 0 && (
            <div className="flex items-center gap-1 bg-[#FFF9FA] p-1 rounded-xl border border-[#E2C0C8]">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  selectedFilter === "all"
                    ? "bg-[#DB2777] text-white shadow-sm"
                    : "text-gray-600 hover:text-[#DB2777]"
                )}
              >
                Semua
              </button>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedFilter(opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    selectedFilter === opt.value
                      ? "bg-[#DB2777] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#DB2777]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {actionButton}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FFF9FA] border-b border-[#E2C0C8] text-gray-600 font-bold uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th key={idx} className={cn("px-6 py-3.5 whitespace-nowrap", col.className)}>
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2C0C8]/40">
            {filteredData.length > 0 ? (
              filteredData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[#E2C0C8]/15 transition-colors duration-150 group"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={cn("px-6 py-4 align-middle", col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-8 h-8 text-[#E2C0C8]" />
                    <p className="font-semibold text-gray-600">Tidak ada data ditemukan</p>
                    <p className="text-xs text-gray-400">
                      Coba sesuaikan kata kunci pencarian atau filter status.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#E2C0C8]/50 bg-[#FFF9FA] flex items-center justify-between text-xs text-gray-500">
        <p>
          Menampilkan <span className="font-bold text-[#DB2777]">{filteredData.length}</span> dari{" "}
          <span className="font-bold text-gray-700">{data.length}</span> total entri
        </p>
        <span className="text-[11px] text-gray-400 font-medium">
          Veloura Real-time Data Sync
        </span>
      </div>
    </div>
  );
}
