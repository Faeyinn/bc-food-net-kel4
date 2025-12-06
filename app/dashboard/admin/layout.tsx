"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Close sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Toggle Button (Floating) - Only visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 p-3 bg-white text-coffee-600 rounded-lg shadow-md border border-gray-100 hover:bg-gray-50 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 w-64 bg-white border-r border-gray-200 h-screen flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:top-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-coffee-100 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-coffee-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500">BC Food Center</p>
            </div>
          </div>
          {/* Close Button for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            <button
              onClick={() => router.push("/dashboard/admin")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive("/dashboard/admin")
                  ? "bg-coffee-50 text-coffee-700 shadow-sm ring-1 ring-coffee-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/admin/users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive("/dashboard/admin/users")
                  ? "bg-coffee-50 text-coffee-700 shadow-sm ring-1 ring-coffee-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Kelola User</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/admin/products")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive("/dashboard/admin/products") ||
                pathname.startsWith("/dashboard/admin/products")
                  ? "bg-coffee-50 text-coffee-700 shadow-sm ring-1 ring-coffee-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Kelola Produk</span>
            </button>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-coffee-200 flex items-center justify-center text-coffee-700 font-bold mr-3">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 pt-20 md:p-8 md:pt-8 w-full">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
