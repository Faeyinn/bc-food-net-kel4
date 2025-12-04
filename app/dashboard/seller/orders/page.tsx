"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import Swal from "sweetalert2";

interface Order {
  id_transaksi: string;
  id_sesi: string; // Used for table number (simplified for now)
  status_pesanan: string;
  total_harga: number;
  // We might need to join with sesi_pemesanan to get table number,
  // but for now let's assume id_sesi or fetch it separately if needed.
  // Or we can just show id_transaksi/id_sesi as identifier.
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;
      try {
        const { data, error } = await supabase
          .from("transaksi")
          .select("*")
          .eq("id_toko", user.uid)
          .order("tanggal_transaksi", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return "bg-red-500 text-white";
      case "DIPROSES":
        return "bg-yellow-500 text-gray-800";
      case "SELESAI":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("transaksi")
        .update({ status_pesanan: newStatus })
        .eq("id_transaksi", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id_transaksi === orderId
            ? { ...order, status_pesanan: newStatus }
            : order
        )
      );
      Swal.fire("Sukses", "Status pesanan diperbarui", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Gagal memperbarui status", "error");
    }
  };

  const handleViewOrder = (orderId: string) => {
    // router.push(`/dashboard/seller/orders/${orderId}`);
    Swal.fire("Info", "Detail pesanan belum tersedia di demo ini", "info");
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-coffee-600 mb-4">
          Promo/Informasi
        </p>
        <h2 className="text-3xl font-bold text-center text-coffee-900">
          PESANAN PELANGGAN
        </h2>
        <p className="text-lg font-semibold text-center text-coffee-700 mb-6">
          {user?.name || "Toko Anda"}
        </p>

        {/* Order List Table */}
        <div className="overflow-x-auto border border-coffee-200 rounded-xl mb-6">
          <table className="min-w-full divide-y divide-coffee-200">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-coffee-700 uppercase tracking-wider text-left">
                  ID Transaksi
                </th>
                <th className="px-4 py-3 text-xs font-bold text-coffee-700 uppercase tracking-wider text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-coffee-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-4 text-center text-coffee-500"
                  >
                    Memuat pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-4 text-center text-coffee-500"
                  >
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id_transaksi}
                    onClick={() => handleViewOrder(order.id_transaksi)}
                    className="cursor-pointer hover:bg-coffee-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-coffee-900">
                      {order.id_transaksi}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative">
                        <select
                          value={order.status_pesanan || "MENUNGGU"}
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleStatusChange(
                              order.id_transaksi,
                              e.target.value
                            );
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent row click event
                          className={`w-full py-1 px-2 pr-8 text-sm font-semibold rounded-lg appearance-none cursor-pointer ${getStatusColor(
                            order.status_pesanan || "MENUNGGU"
                          )}`}
                        >
                          <option
                            value="SELESAI"
                            className="bg-white text-gray-900"
                          >
                            Selesai
                          </option>
                          <option
                            value="DIPROSES"
                            className="bg-white text-gray-900"
                          >
                            Proses
                          </option>
                          <option
                            value="MENUNGGU"
                            className="bg-white text-gray-900"
                          >
                            Menunggu
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
            onClick={() => router.push("/dashboard/seller")}
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
