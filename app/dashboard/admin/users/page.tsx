"use client";

import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, Save } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import Swal from "sweetalert2";

interface User {
  id_user: string;
  nama: string;
  email: string | null;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Edit State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ nama: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Gagal memuat daftar user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id_user", userId);

        if (error) throw error;

        // Log Activity
        const deletedUser = users.find((u) => u.id_user === userId);
        await supabase.from("activity_logs").insert({
          action: "DELETE_USER",
          details: `Admin menghapus user: ${deletedUser?.nama || "Unknown"}`,
        });

        setUsers(users.filter((u) => u.id_user !== userId));
        Swal.fire("Terhapus!", "User telah dihapus.", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus user.", "error");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ nama: user.nama, role: user.role });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ nama: editForm.nama, role: editForm.role })
        .eq("id_user", editingUser.id_user);

      if (error) throw error;

      setUsers(
        users.map((u) =>
          u.id_user === editingUser.id_user
            ? { ...u, nama: editForm.nama, role: editForm.role }
            : u
        )
      );
      setShowEditModal(false);
      Swal.fire("Sukses", "Data user diperbarui", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Gagal memperbarui data user", "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-500 text-sm">
            Total {users.length} pengguna terdaftar
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari user..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64 text-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-600"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Semua Role</option>
            <option value="PEMBELI">Pembeli</option>
            <option value="PENJUAL">Penjual</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  User
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  Role
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  Bergabung
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="animate-pulse flex justify-center">
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3 text-sm">
                          {user.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {user.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "PENJUAL"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_user)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-600"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                >
                  <option value="PEMBELI">PEMBELI</option>
                  <option value="PENJUAL">PENJUAL</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button
                onClick={handleSaveEdit}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
