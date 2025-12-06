"use client";

import React, { useEffect } from "react";
import { ShoppingBag, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-coffee-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-coffee-600 to-coffee-500 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-8 h-8" />
              <div>
                <h1 className="text-lg md:text-xl font-bold">
                  <span className="md:hidden">BC Food Net</span>
                  <span className="hidden md:inline">
                    Business Center Food Net
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-coffee-100">
                  {user.role}{" "}
                  <span className="hidden md:inline">Dashboard</span> (
                  {user.isDemo ? "DEMO" : "AKTIF"})
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-coffee-500 to-coffee-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Selamat Datang, {user.name}! 👋
          </h2>
          <p className="text-coffee-100">Anda masuk sebagai {user.role}</p>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="bg-coffee-800 text-white mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="w-5 h-5" />
            <p>Universitas Andalas, Padang, Sumatera Barat</p>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Business Center Food Net. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
