"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

interface Order {
  id_transaksi: string;
  id_sesi: string;
  status_pesanan: string;
  total_harga: number;
  no_meja?: string;
  jenis_transaksi?: string;
  tanggal_transaksi?: string;
}

interface OrderDetail {
  order_line: string;
  jumlah_item: number;
  subtotal: number;
  catatan: string;
  item: {
    nama_item: string;
    harga_item: number;
    image?: string;
  };
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;
      try {
        const { data, error } = await supabase
          .from("transaksi")
          .select("*, sesi_pemesanan(no_meja)")
          .eq("id_toko", user.uid)
          .order("tanggal_transaksi", { ascending: false });

        if (error) throw error;

        // Map data to handle joined table
        const mappedOrders = (data || []).map((order) => {
          // Explicitly cast relevant parts to handle the join type
          const orderWithJoin = order as Order & {
            sesi_pemesanan:
              | { no_meja?: string }
              | { no_meja?: string }[]
              | null;
          };

          const sesi = Array.isArray(orderWithJoin.sesi_pemesanan)
            ? orderWithJoin.sesi_pemesanan[0]
            : orderWithJoin.sesi_pemesanan;

          return {
            ...order,
            no_meja: sesi?.no_meja || "-",
          };
        });

        setOrders(mappedOrders);
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

  const handlePrintReceipt = (order: Order, details: OrderDetail[]) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150], // Thermal printer size
    });

    // Font setting
    doc.setFont("helvetica", "normal");

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BC Food Net", 40, 10, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Universitas Andalas", 40, 15, { align: "center" });
    doc.text("------------------------------------------------", 40, 18, {
      align: "center",
    });

    // Transaction Info
    doc.setFontSize(8);
    doc.text(`ID: ${order.id_transaksi.substring(0, 13)}...`, 5, 25);
    doc.text(
      `Tgl: ${
        order.tanggal_transaksi
          ? new Date(order.tanggal_transaksi).toLocaleString("id-ID")
          : "-"
      }`,
      5,
      30
    );
    doc.text(`Meja: ${order.no_meja}`, 5, 35);
    doc.text(`Metode: ${order.jenis_transaksi === "NON-TUNAI" ? "QRIS" : (order.jenis_transaksi || "TUNAI")}`, 5, 40);
    doc.text("------------------------------------------------", 40, 45, {
      align: "center",
    });

    // Items
    let yPos = 50;
    details.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${item.item.nama_item}`, 5, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${item.jumlah_item} x Rp ${item.item.harga_item.toLocaleString(
          "id-ID"
        )}`,
        5,
        yPos + 4
      );
      doc.text(`Rp ${item.subtotal.toLocaleString("id-ID")}`, 75, yPos + 4, {
        align: "right",
      });
      yPos += 10;
    });

    // Total
    doc.text("------------------------------------------------", 40, yPos, {
      align: "center",
    });
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL", 5, yPos);
    doc.text(`Rp ${order.total_harga.toLocaleString("id-ID")}`, 75, yPos, {
      align: "right",
    });

    // Footer
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Terima kasih atas kunjungan Anda!", 40, yPos, {
      align: "center",
    });

    doc.save(`Struk-${order.id_transaksi.substring(0, 8)}.pdf`);
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setLoadingDetails(true);
    setOrderDetails([]);

    try {
      const { data, error } = await supabase
        .from("antrian_order")
        .select(
          `
          order_line,
          jumlah_item,
          subtotal,
          catatan,
          item (
            nama_item,
            harga_item,
            image
          )
        `
        )
        .eq("id_transaksi", order.id_transaksi);

      if (error) throw error;

      // Cast data to OrderDetail[] since Supabase types might verify strictly
      setOrderDetails(data as unknown as OrderDetail[]);
    } catch (error) {
      console.error("Error fetching order details:", error);
      Swal.fire("Error", "Gagal memuat detail pesanan", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl titan-one text-center text-coffee-900">
          PESANAN PELANGGAN
        </h2>

        {/* Order List Table */}
        <div className="overflow-x-auto border border-coffee-200 rounded-xl mt-4 mb-6">
          <table className="min-w-full divide-y divide-coffee-200">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-coffee-700 uppercase tracking-wider text-left">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-bold text-coffee-700 uppercase tracking-wider text-left">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold text-coffee-700 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-coffee-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-coffee-500"
                  >
                    Memuat pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-coffee-500"
                  >
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id_transaksi}
                    className="hover:bg-coffee-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-coffee-900">
                      {order.id_transaksi.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative">
                        <select
                          value={order.status_pesanan || "MENUNGGU"}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id_transaksi,
                              e.target.value
                            )
                          }
                          className={`w-full py-1 px-2 pr-8 text-xs font-bold rounded-lg appearance-none cursor-pointer ${getStatusColor(
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
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none text-white" />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-1 bg-coffee-100 text-coffee-700 text-xs font-bold rounded-md hover:bg-coffee-200 transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info & Back Button */}
        <div className="mt-8 text-center">
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

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-coffee-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">Detail Pesanan</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-coffee-700 rounded-full"
              >
                <ChevronDown className="w-6 h-6 rotate-180" />{" "}
                {/* Close Icon */}
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-4 text-sm text-gray-600">
                <p>
                  <strong>ID:</strong> {selectedOrder.id_transaksi}
                </p>
                <p>
                  <strong>Meja:</strong> {selectedOrder.no_meja}
                </p>
                <p>
                  <strong>Total:</strong> Rp{" "}
                  {selectedOrder.total_harga.toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Metode Bayar:</strong>{" "}
                  <span className="font-bold text-coffee-600">
                    {selectedOrder.jenis_transaksi === "NON-TUNAI"
                      ? "QRIS"
                      : selectedOrder.jenis_transaksi || "TUNAI"}
                  </span>
                </p>
              </div>

              {loadingDetails ? (
                <div className="text-center py-8 text-coffee-500">
                  Memuat detail...
                </div>
              ) : (
                <div className="space-y-4">
                  {orderDetails.map((detail) => (
                    <div
                      key={detail.order_line}
                      className="flex space-x-3 border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {detail.item?.image ? (
                          <Image
                            src={detail.item.image}
                            alt={detail.item.nama_item}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {detail.item?.nama_item || "Item dihapus"}
                          </h4>
                          <span className="text-sm font-semibold text-coffee-600">
                            x{detail.jumlah_item}
                          </span>
                        </div>
                        {detail.catatan && (
                          <p className="text-xs text-red-500 italic mt-1">
                            Note: {detail.catatan}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Rp {detail.subtotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
              <button
                onClick={() => handlePrintReceipt(selectedOrder, orderDetails)}
                disabled={loadingDetails}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 flex items-center disabled:opacity-50"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Cetak Struk
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-coffee-600 text-white rounded-lg font-bold text-sm hover:bg-coffee-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
