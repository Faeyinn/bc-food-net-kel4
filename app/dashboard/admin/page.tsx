"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Package, TrendingUp } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

// Add Interface
interface ActivityLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
  type: "LOG" | "USER_REGISTER";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsAndActivities = async () => {
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

        // Fetch Activity Logs
        const { data: logs, error: logsError } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        // Fetch Recent Registrations
        const { data: newUsers, error: newUsersError } = await supabase
          .from("users")
          .select("id_user, nama, role, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (userError) console.error("Error fetching user count", userError);
        if (sellerError)
          console.error("Error fetching seller count", sellerError);
        if (productError)
          console.error("Error fetching product count", productError);
        if (logsError) console.error("Error fetching activity logs", logsError);
        if (newUsersError)
          console.error("Error fetching new users", newUsersError);

        setStats({
          users: userCount || 0,
          sellers: sellerCount || 0,
          products: productCount || 0,
        });

        // Combine and Sort Activities
        const formattedLogs: ActivityLog[] = (logs || []).map((log: any) => ({
          id: log.id,
          action: log.action,
          details: log.details,
          created_at: log.created_at,
          type: "LOG",
        }));

        const formattedUsers: ActivityLog[] = (newUsers || []).map(
          (user: any) => ({
            id: user.id_user,
            action: "USER_REGISTER",
            details: `User baru mendaftar: ${user.nama} (${user.role})`,
            created_at: user.created_at,
            type: "USER_REGISTER",
          })
        );

        const combined = [...formattedLogs, ...formattedUsers]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 10);

        setActivities(combined);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl titan-one text-gray-900">
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
          <div className="bg-[#faf6ae] p-6 rounded-2xl shadow-lg text-gray-800 transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-800/20 rounded-xl">
                <Users className="w-6 h-6 text-gray-800" />
              </div>
              <span className="text-xs font-semibold bg-gray-800/20 px-2 py-1 rounded-full flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
            <h3 className="text-gray-800 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-1">{stats.users}</p>
          </div>

          <div className="bg-[#71635e] p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all cursor-pointer">
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

      {/* Activity Feed */}
      <div className="mt-8">
        <h3 className="font-bold text-gray-900 mb-4 titan-one text-xl">
          Aktivitas Terkini
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Belum ada aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id + activity.created_at}
                  className="flex items-start"
                >
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      activity.type === "USER_REGISTER"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } mr-4`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.created_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
