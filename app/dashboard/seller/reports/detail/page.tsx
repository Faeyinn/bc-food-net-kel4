"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRupiah } from "../../../../utils/format";
import { mockReportData, TopItem } from "../../../../utils/mockReportData";

export default function SellerReportDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get("period");
  const reportData = period ? mockReportData[period] : null;

  if (!reportData) {
    return (
      <div className="text-center p-8">
        <p>Data laporan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="text-green-600 mt-4">
          Kembali
        </button>
      </div>
    );
  }

  const formatPercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return "N/A";
    return ((numerator / denominator) * 100).toFixed(2) + "%";
  };

  const totalPenjualan = reportData.cash + reportData.qr;
  const persentaseCash = formatPercentage(reportData.cash, totalPenjualan);
  const persentaseQR = formatPercentage(reportData.qr, totalPenjualan);
  const rugi = 0; // Menggunakan mock data
  const untung = totalPenjualan - rugi;

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-green-600 mb-4">
          Promo/Informasi
        </p>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          REKAP PENJUALAN ({reportData.period})
        </h2>

        {/* Table Laporan */}
        <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-left">
                  Item
                </th>
                <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-center">
                  Qty
                </th>
                <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">
                  Harga
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.topItems.map((item: TopItem, index: number) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                    {formatRupiah(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ringkasan Laporan */}
        <div className="space-y-2 text-gray-800 mb-8">
          <p className="flex justify-between font-semibold border-b pb-1">
            <span>Total Penjualan</span>{" "}
            <span className="text-xl font-bold text-green-700">
              {formatRupiah(totalPenjualan)}
            </span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Pembayaran QR ({persentaseQR})</span>{" "}
            <span>{formatRupiah(reportData.qr)}</span>
          </p>
          <p className="flex justify-between text-sm border-b pb-2">
            <span>Pembayaran Cash ({persentaseCash})</span>{" "}
            <span>{formatRupiah(reportData.cash)}</span>
          </p>
          <p className="flex justify-between text-sm text-red-600">
            <span>Rugi</span> <span>{formatRupiah(rugi)}</span>
          </p>
          <p className="flex justify-between font-bold pt-2 border-t">
            <span>Untung</span>{" "}
            <span className="text-green-600">{formatRupiah(untung)}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-md"
          >
            Kembali
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <button className="text-green-600 font-semibold hover:text-green-700 flex items-center justify-center mx-auto mb-6">
            Info Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex justify-center mb-4 space-x-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
