"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRupiah } from "../../../../utils/format";
import { useAuth } from "../../../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface ReportData {
  period: string;
  totalRevenue: number;
  cashRevenue: number;
  qrRevenue: number;
  topItems: TopItem[];
}

export default function SellerReportDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const period = searchParams.get("period") || "Hari Ini";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      setLoading(true);

      try {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        // Determine date range
        if (period === "Hari Ini") {
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
        } else if (period === "Minggu Ini") {
          // Start of week (Monday)
          const day = now.getDay() || 7; // Get current day number, converting Sun (0) to 7
          if (day !== 1) {
            startDate.setHours(-24 * (day - 1));
          }
          startDate.setHours(0, 0, 0, 0);
          // If today is Monday, setHours with negative might be tricky, simplified:
          // Better approach:
          const today = new Date();
          const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0 for Monday, 6 for Sunday
          const lastMonday = new Date(
            today.setDate(today.getDate() - dayOfWeek)
          );
          lastMonday.setHours(0, 0, 0, 0);
          startDate = lastMonday;

          const nextSunday = new Date(lastMonday);
          nextSunday.setDate(lastMonday.getDate() + 6);
          nextSunday.setHours(23, 59, 59, 999);
          endDate = nextSunday;
        } else if (period === "Bulan Ini") {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        }

        // Fetch Transactions
        const { data: transactions, error: transError } = await supabase
          .from("transaksi")
          .select("*")
          .eq("id_toko", user.uid)
          .eq("status_pesanan", "SELESAI")
          .gte("tanggal_transaksi", startDate.toISOString())
          .lte("tanggal_transaksi", endDate.toISOString());

        if (transError) throw transError;

        if (!transactions || transactions.length === 0) {
          setData({
            period,
            totalRevenue: 0,
            cashRevenue: 0,
            qrRevenue: 0,
            topItems: [],
          });
          setLoading(false);
          return;
        }

        const transIds = transactions.map((t) => t.id_transaksi);

        let totalRev = 0;
        let cashRev = 0;
        let qrRev = 0;

        transactions.forEach((t) => {
          const amount = t.total_harga || 0;
          totalRev += amount;
          if (t.jenis_transaksi === "TUNAI") {
            cashRev += amount;
          } else {
            qrRev += amount;
          }
        });

        // Fetch Order Items for Top Selling
        // We need to fetch items that belong to these transactions
        const { data: orderItems, error: itemsError } = await supabase
          .from("antrian_order")
          .select(
            `
            id_item,
            jumlah_item,
            subtotal,
            item (
                nama_item
            )
           `
          )
          .in("id_transaksi", transIds);

        if (itemsError) throw itemsError;

        // Aggregate Top Items
        const itemMap = new Map<string, TopItem>();

        // Helper type for the join result
        interface RawOrderItem {
          id_item: string;
          jumlah_item: number;
          subtotal: number;
          item: { nama_item: string } | { nama_item: string }[];
        }

        ((orderItems as unknown as RawOrderItem[]) || []).forEach((row) => {
          // Handle item array/object issue again just in case
          const itemDetails = Array.isArray(row.item) ? row.item[0] : row.item;
          const name = itemDetails?.nama_item || "Unknown Item";
          const id = row.id_item;

          if (!itemMap.has(id)) {
            itemMap.set(id, {
              name,
              quantity: 0,
              revenue: 0,
            });
          }

          const current = itemMap.get(id)!;
          current.quantity += row.jumlah_item;
          current.revenue += row.subtotal;
        });

        // Convert map to array and sort
        const topItems = Array.from(itemMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5); // Take top 5

        setData({
          period,
          totalRevenue: totalRev,
          cashRevenue: cashRev,
          qrRevenue: qrRev,
          topItems,
        });
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, period]);

  const formatPercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return "0%";
    return ((numerator / denominator) * 100).toFixed(0) + "%";
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-coffee-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat Laporan...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center p-4">Data tidak tersedia</div>;

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          REKAP PENJUALAN ({data.period.toUpperCase()})
        </h2>

        {/* Table Laporan */}
        {data.topItems.length > 0 ? (
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
                    Omset
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topItems.map((item: TopItem, index: number) => (
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
        ) : (
          <p className="text-center text-gray-500 mb-6 italic">
            Belum ada penjualan pada periode ini.
          </p>
        )}

        {/* Ringkasan Laporan */}
        <div className="space-y-2 text-gray-800 mb-8">
          <p className="flex justify-between font-semibold border-b pb-1">
            <span>Total Penjualan</span>{" "}
            <span className="text-xl font-bold text-green-700">
              {formatRupiah(data.totalRevenue)}
            </span>
          </p>
          <p className="flex justify-between text-sm">
            <span>
              Pembayaran QR (
              {formatPercentage(data.qrRevenue, data.totalRevenue)})
            </span>{" "}
            <span>{formatRupiah(data.qrRevenue)}</span>
          </p>
          <p className="flex justify-between text-sm border-b pb-2">
            <span>
              Pembayaran Cash (
              {formatPercentage(data.cashRevenue, data.totalRevenue)})
            </span>{" "}
            <span>{formatRupiah(data.cashRevenue)}</span>
          </p>
          {/* Removed Rugi/Untung logic as it requires COGS data which we don't have */}
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
