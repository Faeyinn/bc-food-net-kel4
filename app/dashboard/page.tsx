"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import {
  Settings,
  ChevronRight,
  Home,
  Package,
  Users,
  ShoppingBag,
} from "lucide-react";
import { formatRupiah } from "@/app/utils/format";

interface PopulerItem {
  id_item: string;
  nama_item: string;
  harga_item: number;
  image?: string;
  users: {
    nama: string;
  } | null; // Join result might be null/array depending on data, but assuming object for single relation
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [popularItems, setPopularItems] = useState<PopulerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Normalize role to uppercase for comparison to be safe,
      // though DB returns uppercase.
      const role = user.role.toUpperCase();
      if (role === "PEMBELI") {
        router.push("/dashboard/buyer");
      } else if (role === "PENJUAL") {
        router.push("/dashboard/seller");
      } else if (role === "ADMIN") {
        router.push("/dashboard/admin");
      }
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const { data, error } = await supabase
          .from("item")
          .select(
            `
            id_item,
            nama_item,
            harga_item,
            image,
            users (
              nama
            )
          `
          )
          .limit(6);

        if (error) throw error;

        // Supabase join returns array or object depending on relation.
        // Assuming users is a single object here (one-to-many from users to items inverted).
        // Safely casting or mapping:
        const formattedData: PopulerItem[] = (data || []).map((item: any) => ({
          id_item: item.id_item,
          nama_item: item.nama_item,
          harga_item: item.harga_item,
          image: item.image,
          users: Array.isArray(item.users) ? item.users[0] : item.users,
        }));

        setPopularItems(formattedData);
      } catch (error) {
        console.error("Error fetching popular items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  if (!user) return null;

  // Guest or Default View (if not redirected yet)
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
          <div className="bg-coffee-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Home className="w-5 h-5 md:w-6 md:h-6 text-coffee-600" />
          </div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            Beranda
          </h3>
          <p className="text-xs md:text-sm text-gray-600">Lihat menu populer</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
          <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            Pesanan
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Kelola pesanan Anda
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
          <div className="bg-purple-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            Merchant
          </h3>
          <p className="text-xs md:text-sm text-gray-600">Daftar penjual</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
          <div className="bg-orange-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            Pengaturan
          </h3>
          <p className="text-xs md:text-sm text-gray-600">Atur profil Anda</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu Populer</h2>
          <button className="text-coffee-600 font-semibold hover:text-coffee-700 flex items-center">
            Lihat Semua <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 h-32 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : popularItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada menu populer.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <div
                key={item.id_item}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="bg-gradient-to-br from-coffee-400 to-coffee-500 h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.nama_item}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-white opacity-50" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.nama_item}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.users?.nama || "Unknown Merchant"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-coffee-600 font-bold">
                    {formatRupiah(item.harga_item)}
                  </span>
                  <span className="text-sm text-yellow-600">⭐ 4.8</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
