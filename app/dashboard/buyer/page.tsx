"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import Swal from "sweetalert2";
import Image from "next/image";

interface Store {
  id_user: string;
  nama: string;
  is_open: boolean;
}

export default function BuyerHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromo, setShowPromo] = useState(true);

  const handleTableNumberChange = (value: string) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) return;

    if (value !== "") {
      const num = parseInt(value);
      if (num < 1 || num > 30) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Meja hanya tersedia dari 1 sampai 30",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }
    }
    setTableNumber(value);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id_user, nama, is_open")
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
    if (!store.is_open) {
      Swal.fire({
        icon: "error",
        title: "Toko Tutup",
        text: "Maaf, toko ini sedang tutup.",
        confirmButtonColor: "#8d6e63",
      });
      return;
    }

    if (!tableNumber) {
      Swal.fire({
        icon: "warning",
        title: "Mohon Maaf",
        text: "Harap isi nomor meja terlebih dahulu.",
        confirmButtonColor: "#8d6e63",
      });
      return;
    }

    const params = new URLSearchParams();
    params.set("storeId", store.id_user);
    params.set("storeName", store.nama);
    params.set("tableNumber", tableNumber);

    router.push(`/dashboard/buyer/order?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      {/* Promo Popup */}
      {showPromo && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPromo(false)}
          />
          <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl animate-scale-up">
            <button
              onClick={() => setShowPromo(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full aspect-video">
              <Image
                src="/grand-launching.jpg"
                alt="Grand Launching"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* History Button */}
        <button
          onClick={() => router.push("/dashboard/buyer/history")}
          className="w-full mt-4 mb-6 py-2 px-4 bg-white border border-coffee-200 text-coffee-700 font-semibold rounded-xl shadow-sm hover:bg-coffee-50 transition-all flex items-center justify-center"
        >
          <Clock className="w-4 h-4 mr-2" />
          Riwayat Pesanan
        </button>

        {/* Table/Time Header */}
        <div className="flex justify-around text-center text-gray-600 text-sm mb-6 space-x-4">
          <div className="p-3 bg-coffee-50 rounded-lg flex-1">
            <p className="font-semibold text-coffee-800">No. Meja</p>
            <input
              type="text"
              placeholder=""
              value={tableNumber}
              onChange={(e) => handleTableNumberChange(e.target.value)}
              className="w-full px-1 py-1 text-base text-center bg-transparent border-b border-coffee-300 focus:border-coffee-600 outline-none font-bold text-coffee-900"
            />
          </div>
        </div>

        <h3 className="text-lg titan-one-100 font-semibold text-center text-coffee-800 mb-6 border-b border-coffee-100 pb-4">
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
                className={`w-full py-4 px-6 flex justify-between items-center bg-coffee-50 hover:bg-coffee-100 text-coffee-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md border border-coffee-100 ${
                  !store.is_open ? "opacity-75 grayscale" : ""
                }`}
              >
                <span>{store.nama}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    store.is_open
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {store.is_open ? "Buka" : "Tutup"}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/info-bc")}
            className="text-coffee-600 font-semibold hover:text-coffee-700 flex items-center justify-center mx-auto mb-6"
          >
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
