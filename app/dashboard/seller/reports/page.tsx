"use client";

import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function SellerReportsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSelectReport = (period: string) => {
    router.push(
      `/dashboard/seller/reports/view?period=${encodeURIComponent(period)}`
    );
  };

  const handleBackToHome = () => {
    router.push("/dashboard/seller");
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-coffee-600 mb-4">
          Promo/Informasi
        </p>
        <h2 className="text-3xl font-bold text-center text-coffee-900 mb-6">
          LAPORAN PENJUALAN
        </h2>

        {/* Pilihan Periode Laporan */}
        <div className="space-y-4 mb-8">
          {["Hari Ini", "Minggu Ini", "Bulan Ini"].map((period) => (
            <button
              key={period}
              onClick={() => handleSelectReport(period)}
              className="w-full py-4 bg-coffee-50 hover:bg-coffee-100 text-coffee-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md border border-coffee-100"
            >
              {period}
            </button>
          ))}
        </div>

        {/* Footer Info & Back Button */}
        <div className="mt-8 text-center">
          <button className="text-coffee-600 font-semibold hover:text-coffee-700 flex items-center justify-center mx-auto mb-6">
            Info Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex justify-center mb-4 space-x-3">
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
          </div>

          <button
            onClick={handleBackToHome}
            className="text-coffee-600 font-semibold hover:text-coffee-800 flex items-center justify-center mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
