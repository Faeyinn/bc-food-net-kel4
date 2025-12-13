"use client";

import React, { useState, useEffect } from "react";
import { Store, ClipboardList, BarChart3, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";

export default function SellerHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCountAndStatus = async () => {
      if (!user?.uid) return;

      try {
        // Fetch Status
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_open")
          .eq("id_user", user.uid)
          .single();

        if (userData) {
          setIsStoreOpen(userData.is_open);
        }

        const { count, error } = await supabase
          .from("transaksi")
          .select("*", { count: "exact", head: true })
          .eq("id_toko", user.uid)
          .neq("status_pesanan", "SELESAI"); // Assuming 'SELESAI' means completed

        if (error) throw error;
        setOrderCount(count || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderCountAndStatus();
  }, [user]);

  const toggleStoreStatus = async () => {
    if (!user?.uid) return;
    const newStatus = !isStoreOpen;
    setIsStoreOpen(newStatus); // Optimistic update

    try {
      const { error } = await supabase
        .from("users")
        .update({ is_open: newStatus })
        .eq("id_user", user.uid);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating store status", error);
      setIsStoreOpen(!newStatus); // Revert on error
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Store Status Toggle */}
        <div className="flex items-center justify-between mb-8 bg-coffee-50 p-4 rounded-xl">
          <div>
            <p className="text-sm text-coffee-500 font-medium">Status Toko</p>
            <p
              className={`font-bold ${
                isStoreOpen ? "text-green-600" : "text-red-500"
              }`}
            >
              {isStoreOpen ? "BUKA" : "TUTUP"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isStoreOpen}
              onChange={toggleStoreStatus}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coffee-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => router.push("/dashboard/seller/manage")}
            className="flex items-center p-4 bg-coffee-50 hover:bg-coffee-100 rounded-xl transition-all group"
          >
            <div className="p-3 bg-coffee-100 text-coffee-600 rounded-lg group-hover:bg-white transition-colors">
              <Store className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-bold text-gray-900">Kelola Toko</h3>
              <p className="text-xs text-gray-500">Edit menu & info toko</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push("/dashboard/seller/orders")}
            className="flex items-center p-4 bg-coffee-50 hover:bg-coffee-100 rounded-xl transition-all group"
          >
            <div className="p-3 bg-coffee-100 text-coffee-600 rounded-lg group-hover:bg-white transition-colors">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-bold text-gray-900">Pesanan Masuk</h3>
              <p className="text-xs text-gray-500">Cek pesanan pelanggan</p>
            </div>
            {orderCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {orderCount}
              </div>
            )}
          </button>

          <button
            onClick={() => router.push("/dashboard/seller/reports")}
            className="flex items-center p-4 bg-coffee-50 hover:bg-coffee-100 rounded-xl transition-all group"
          >
            <div className="p-3 bg-coffee-100 text-coffee-600 rounded-lg group-hover:bg-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-bold text-gray-900">Laporan Penjualan</h3>
              <p className="text-xs text-gray-500">Rekap pendapatan</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex justify-center mb-4 space-x-3">
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-coffee-400 mt-4">
        {user?.isDemo ? "Mode Demo" : "Mode Aktif"} | {user?.name || user?.uid}
      </p>
    </div>
  );
}
