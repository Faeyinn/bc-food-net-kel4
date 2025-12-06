"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Package, TrendingUp } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch User Count
        const { count: userCount, error: userError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        // Fetch Seller Count
        const { count: sellerCount, error: sellerError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "PENJUAL");

        // Fetch Product Count
        const { count: productCount, error: productError } = await supabase
          .from("item")
          .select("*", { count: "exact", head: true });

        if (userError) console.error("Error fetching user count", userError);
        if (sellerError)
          console.error("Error fetching seller count", sellerError);
        if (productError)
          console.error("Error fetching product count", productError);

        setStats({
          users: userCount || 0,
          sellers: sellerCount || 0,
          products: productCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-500">Selamat datang kembali, Admin.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-white px-3 py-1 rounded-full border border-gray-200 mt-2 md:mt-0">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-medium text-gray-600">Sistem Online</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-32 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
            <h3 className="text-blue-100 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-1">{stats.users}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Store className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-orange-100 text-sm font-medium">
              Total Penjual
            </h3>
            <p className="text-3xl font-bold mt-1">{stats.sellers}</p>
          </div>

          <div className="bg-gradient-to-br from-coffee-500 to-coffee-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-coffee-100 text-sm font-medium">
              Total Produk
            </h3>
            <p className="text-3xl font-bold mt-1">{stats.products}</p>
          </div>
        </div>
      )}

      {/* Quick Actions or Recent Activity could go here */}
      <div className="mt-8">
        <h3 className="font-bold text-gray-900 mb-4">Aktivitas Terkini</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-400">Belum ada aktivitas tercatat.</p>
        </div>
      </div>
    </div>
  );
}
