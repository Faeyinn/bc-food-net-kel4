"use client";

import React from "react";
import { CheckCircle, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "../../../utils/format";
import { useData } from "../../../context/DataContext";

interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export default function BuyerTransactionPage() {
  const router = useRouter();
  const { buyerTransaction } = useData();

  if (!buyerTransaction) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-xl mt-8">
        <p className="text-gray-600 mb-4">
          Tidak ada transaksi aktif saat ini.
        </p>
        <button
          onClick={() => router.push("/dashboard/buyer")}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const {
    id,
    storeName,
    tableNumber,
    items,
    totalAmount,
    status,
    timestamp,
    paymentMethod,
  } = buyerTransaction;

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Status Header */}
        <div className="bg-green-50 p-6 text-center border-b border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Pesanan Diterima!
          </h2>
          <p className="text-gray-600 text-sm">
            Mohon tunggu, pesanan Anda sedang disiapkan.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 space-y-6">
          {/* Info Utama */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">ID Transaksi</p>
              <p className="font-bold text-gray-900">{id}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Waktu</p>
              <p className="font-bold text-gray-900">{timestamp}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Metode Bayar</p>
              <p className="font-bold text-gray-900">{paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Status</p>
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                {status}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 my-4"></div>

          {/* Store & Table Info */}
          <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">{storeName}</p>
              <p className="text-sm text-gray-600">Meja No. {tableNumber}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Rincian Pesanan</h3>
            <div className="space-y-3">
              {items.map((item: TransactionItem, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-semibold text-gray-800">
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && (
                      <p className="text-xs text-gray-500 ml-4">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Bayar</span>
              <span className="text-green-600">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => router.push("/dashboard/buyer")}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
