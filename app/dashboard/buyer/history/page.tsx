"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Store,
  Clock,
  ChevronRight,
  X,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useData } from "../../../context/DataContext";
import { supabase } from "@/app/lib/supabase";
import { formatRupiah } from "../../../utils/format";

interface Transaction {
  id_transaksi: string;
  id_sesi: string;
  id_toko: string;
  total_harga: number;
  status_pesanan: string;
  tanggal_transaksi: string;
  jenis_transaksi: string;
  store_name?: string;
}

interface OrderItem {
  id_item: string;
  jumlah_item: number;
  subtotal: number;
  catatan?: string;
  item: {
    nama_item: string;
    harga_item: number;
    image?: string;
  };
}

// Helper interface for raw Supabase response
interface RawOrderItem {
  id_item: string;
  jumlah_item: number;
  subtotal: number;
  catatan?: string;
  item:
    | {
        nama_item: string;
        harga_item: number;
        image?: string;
      }
    | {
        nama_item: string;
        harga_item: number;
        image?: string;
      }[];
}

export default function BuyerHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { buyerTransaction } = useData();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // tick to trigger re-render for realtime timestamps
  const [tick, setTick] = useState(0);

  // Modal State
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.uid) return;
      try {
        // 1. Get Sessions
        const { data: sessions, error: sessionError } = await supabase
          .from("sesi_pemesanan")
          .select("id_sesi")
          .eq("id_pelanggan", user.uid);

        if (sessionError) throw sessionError;

        if (!sessions || sessions.length === 0) {
          setLoading(false);
          return;
        }

        const sessionIds = sessions.map((s) => s.id_sesi);

        // 2. Get Transactions
        const { data: transJson, error: transError } = await supabase
          .from("transaksi")
          .select("*")
          .in("id_sesi", sessionIds)
          .order("tanggal_transaksi", { ascending: false });

        if (transError) throw transError;

        const transList = transJson as Transaction[];

        // 3. Get Store Names
        const storeIds = Array.from(
          new Set(transList.map((t) => t.id_toko))
        ).filter(Boolean);

        if (storeIds.length > 0) {
          const { data: stores, error: storeError } = await supabase
            .from("users")
            .select("id_user, nama")
            .in("id_user", storeIds);

          if (storeError) throw storeError;

          const storeMap = (stores || []).reduce(
            (acc: { [key: string]: string }, store) => {
              acc[store.id_user] = store.nama;
              return acc;
            },
            {}
          );

          transList.forEach((t) => {
            t.store_name = storeMap[t.id_toko] || "Toko Tidak Dikenal";
          });
        }

        setTransactions(transList);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // update tick every 30 seconds to refresh relative timestamps
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // Robust parsing: try native parse and also try forcing UTC (append Z).
  // Choose the parse result that is closest to now (heuristic) so stored timestamps
  // without timezone are interpreted correctly.
  const parseTimestampBest = (dateStr?: string) => {
    if (!dateStr) return null;
    const tryParse = (s: string) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    };

    const candidates: Date[] = [];
    const p1 = tryParse(dateStr);
    if (p1) candidates.push(p1);

    // if no timezone info, try appending Z to treat as UTC
    if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateStr)) {
      const p2 = tryParse(dateStr + "Z");
      if (p2) candidates.push(p2);
    }

    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    // pick the candidate whose timestamp is closest to now
    const now = Date.now();
    let best = candidates[0];
    let bestDiff = Math.abs(now - best.getTime());
    for (let i = 1; i < candidates.length; i++) {
      const diff = Math.abs(now - candidates[i].getTime());
      if (diff < bestDiff) {
        best = candidates[i];
        bestDiff = diff;
      }
    }
    return best;
  };

  const formatRelativeTime = (dateStr?: string) => {
    const d = parseTimestampBest(dateStr);
    if (!d) return "-";
    const dt = d.getTime();
    const diffSec = Math.floor((Date.now() - dt) / 1000);
    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    // fallback to formatted date in WIB
    try {
      const fmt = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return fmt.format(d) + " WIB";
    } catch (e) {
      return d.toLocaleString();
    }
  };

  const formatFullDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    // Format explicitly in WIB (Asia/Jakarta) regardless of client timezone
    try {
      const fmt = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${fmt.format(d)} WIB`;
    } catch (e) {
      return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const fetchTransactionDetails = async (transaction: Transaction) => {
    setLoadingDetails(true);
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
    try {
      const { data, error } = await supabase
        .from("antrian_order")
        .select(
          `
          id_item,
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
        .eq("id_transaksi", transaction.id_transaksi);

      if (error) throw error;

      // Map raw data to match defined interface
      // Supabase sometimes returns relation as array if not strictly 1:1 inferred
      const rawData = data as unknown as RawOrderItem[];
      const items: OrderItem[] = rawData.map((row) => {
        // Take first item if array, or object if object
        const itemData = Array.isArray(row.item) ? row.item[0] : row.item;
        return {
          id_item: row.id_item,
          jumlah_item: row.jumlah_item,
          subtotal: row.subtotal,
          catatan: row.catatan,
          item: itemData,
        };
      });
      setOrderItems(items);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "MENUNGGU":
        return "bg-yellow-100 text-yellow-700";
      case "DIPROSES":
        return "bg-blue-100 text-blue-700";
      case "SELESAI":
        return "bg-green-100 text-green-700";
      case "DIBATALKAN":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.push("/dashboard/buyer")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Riwayat Pesanan</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Memuat riwayat...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Belum Ada Pesanan
          </h3>
          <p className="text-gray-500 mb-6">
            Anda belum pernah melakukan pemesanan.
          </p>
          <button
            onClick={() => router.push("/dashboard/buyer")}
            className="px-6 py-2 bg-coffee-600 text-white font-bold rounded-xl hover:bg-coffee-700 transition-all"
          >
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {transactions.map((t) => (
            <div
              key={t.id_transaksi}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => fetchTransactionDetails(t)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-coffee-50 rounded-lg group-hover:bg-coffee-100 transition-colors">
                    <Store className="w-4 h-4 text-coffee-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {t.store_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {buyerTransaction && buyerTransaction.id === t.id_transaksi
                        ? buyerTransaction.timestamp
                        : formatFullDateTime(t.tanggal_transaksi)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(
                    t.status_pesanan
                  )}`}
                >
                  {t.status_pesanan}
                </span>
              </div>

              <div className="flex justify-between items-center pl-10">
                <div className="flex bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200">
                  {String(t.jenis_transaksi || "").toUpperCase() === "NON-TUNAI"
                    ? "QRIS"
                    : t.jenis_transaksi}
                </div>
                <div className="flex items-center">
                  <p className="font-bold text-coffee-600 text-lg mr-2">
                    {formatRupiah(t.total_harga)}
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900">Detail Pesanan</h3>
                <p className="text-xs text-gray-500">
                  ID: {selectedTransaction.id_transaksi}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-xs font-bold mt-1 ${getStatusColor(
                      selectedTransaction.status_pesanan
                    )}`}
                  >
                    {selectedTransaction.status_pesanan}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {buyerTransaction &&
                    buyerTransaction.id === selectedTransaction.id_transaksi
                      ? buyerTransaction.timestamp
                      : formatFullDateTime(selectedTransaction.tanggal_transaksi)}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2 text-coffee-600" /> Item
                Pesanan
              </h4>

              {loadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-coffee-200 border-t-coffee-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.item?.nama_item || "Item dihapus"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.jumlah_item} x{" "}
                          {formatRupiah(item.item?.harga_item || 0)}
                        </p>
                        {item.catatan && (
                          <p className="text-xs text-gray-400 mt-1 italic">
                            &quot;{item.catatan}&quot;
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-xl text-coffee-600">
                    {formatRupiah(selectedTransaction.total_harga)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
