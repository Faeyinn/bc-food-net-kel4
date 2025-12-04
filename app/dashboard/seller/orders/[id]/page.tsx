"use client";

import React, { use } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useData } from "../../../../context/DataContext";
import { formatRupiah } from "../../../../utils/format";

export default function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { sellerOrders, updateSellerOrders } = useData();
  const { id } = use(params);
  const orderId = parseInt(id);
  const order = sellerOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center p-8">
        <p>Pesanan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="text-green-600 mt-4">
          Kembali
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    updateSellerOrders(order.id, newStatus);
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-green-600 mb-4">
          Promo/Informasi
        </p>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          DETAIL PESANAN
        </h2>
        <p className="text-lg font-semibold text-center text-gray-700 mb-6">
          Nama Toko
        </p>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Nama Pelanggan:</span>
            <span className="font-bold text-gray-900">{order.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">No Meja:</span>
            <span className="font-bold text-gray-900">{order.table}</span>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-xl mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider text-left">
                  Menu
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider text-center">
                  Jml
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">
                  Harga
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="font-medium">{item.name}</div>
                    {item.notes && (
                      <div className="text-xs text-gray-500 italic mt-1">
                        Note: {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                    {formatRupiah(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                >
                  Total
                </td>
                <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">
                  {formatRupiah(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleStatusChange("Selesai")}
            className={`w-full py-3 font-bold rounded-xl transition-all shadow-md ${
              order.status === "Selesai"
                ? "bg-green-600 text-white cursor-default"
                : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50"
            }`}
          >
            {order.status === "Selesai" ? "Pesanan Selesai" : "Tandai Selesai"}
          </button>
          <button
            onClick={() => handleStatusChange("Proses")}
            className={`w-full py-3 font-bold rounded-xl transition-all shadow-md ${
              order.status === "Proses"
                ? "bg-yellow-500 text-gray-900 cursor-default"
                : "bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            }`}
          >
            {order.status === "Proses" ? "Sedang Diproses" : "Proses Pesanan"}
          </button>
        </div>

        {/* Footer Info & Back Button */}
        <div className="mt-8 text-center">
          <button className="text-green-600 font-semibold hover:text-green-700 flex items-center justify-center mx-auto mb-6">
            Info Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex justify-center mb-4 space-x-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>

          <button
            onClick={() => router.back()}
            className="text-gray-600 font-semibold hover:text-gray-800 flex items-center justify-center mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
