"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Settings,
  ChevronRight,
  Home,
  Package,
  Users,
  ShoppingBag,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Normalize role to uppercase for comparison to be safe,
      // though DB returns uppercase.
      const role = user.role.toUpperCase();
      if (role === "PEMBELI") {
        router.push("/dashboard/buyer");
      } else if (role === "PENJUAL") {
        router.push("/dashboard/seller");
      }
    }
  }, [user, router]);

  if (!user) return null;

  // Check for Admin (Uppercase)
  if (user.role.toUpperCase() === "ADMIN") {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <Settings className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Halaman Admin</h2>
        <p className="text-gray-600">
          Selamat datang, Admin. Area ini untuk manajemen sistem.
        </p>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Nasi Goreng Special",
              price: "Rp 12.000",
              merchant: "Warung Bu Yanti",
              rating: "4.8",
            },
            {
              name: "Mie Ayam Jumbo",
              price: "Rp 12.000",
              merchant: "Mie Ayam Pak Udin",
              rating: "4.7",
            },
            {
              name: "Es Teh Manis",
              price: "Rp 5.000",
              merchant: "Kantin Sentral",
              rating: "4.9",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-gradient-to-br from-coffee-400 to-coffee-500 h-40 rounded-lg mb-4 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-white opacity-50" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.merchant}</p>
              <div className="flex items-center justify-between">
                <span className="text-coffee-600 font-bold">{item.price}</span>
                <span className="text-sm text-yellow-600">
                  ⭐ {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
