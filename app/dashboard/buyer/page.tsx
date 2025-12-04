"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";

interface Store {
  id_user: string;
  nama: string;
}

export default function BuyerHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id_user, nama")
          .eq("role", "PENJUAL");

        if (error) throw error;
        setStores(data || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSelectStore = (store: Store) => {
    const params = new URLSearchParams();
    params.set("storeId", store.id_user);
    params.set("storeName", store.nama);
    if (tableNumber) params.set("tableNumber", tableNumber);

    router.push(`/dashboard/buyer/order?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-coffee-600 mb-4">
          Promo/Informasi
        </p>

        {/* Table/Time Header */}
        <div className="flex justify-around text-center text-gray-600 text-sm mb-6 space-x-4">
          <div className="p-3 bg-coffee-50 rounded-lg flex-1">
            <p className="font-semibold text-coffee-800">No. Meja</p>
            <input
              type="text"
              placeholder="15"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-1 py-1 text-base text-center bg-transparent border-b border-coffee-300 focus:border-coffee-600 outline-none font-bold text-coffee-900"
            />
          </div>
          <div className="p-3 bg-coffee-50 rounded-lg flex-1">
            <p className="font-semibold text-coffee-800">Hari / Tanggal</p>
            <p className="text-xs text-coffee-700 font-medium mt-1">
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-center text-coffee-800 mb-6 border-b border-coffee-100 pb-4">
          Mau makan dimana hari ini ?
        </h3>

        {/* Store List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Memuat Toko...</p>
          ) : (
            stores.map((store) => (
              <button
                key={store.id_user}
                onClick={() => handleSelectStore(store)}
                className="w-full py-4 bg-coffee-50 hover:bg-coffee-100 text-coffee-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md border border-coffee-100"
              >
                {store.nama}
              </button>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <button className="text-coffee-600 font-semibold hover:text-coffee-700 flex items-center justify-center mx-auto mb-6">
            Info Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
          </button>

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
