"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "../../../components/ui/Modal";
import MenuModal, {
  MenuItem as ModalMenuItem,
} from "../../../components/seller/MenuModal";
import { formatRupiah } from "../../../utils/format";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import Swal from "sweetalert2";

// Interface matching DB schema
interface DBMenuItem {
  id_item: string;
  nama_item: string;
  harga_item: number;
  id_toko: string;
  image?: string;
}

export default function ManageStorePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [menuList, setMenuList] = useState<DBMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ModalMenuItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DBMenuItem | null>(null);

  // Fetch Menu Items
  useEffect(() => {
    const fetchMenu = async () => {
      if (!user?.uid) return;
      try {
        const { data, error } = await supabase
          .from("item")
          .select("*")
          .eq("id_toko", user.uid);

        if (error) throw error;
        setMenuList(data || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
        Swal.fire("Error", "Gagal memuat menu", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [user]);

  const handleSaveMenu = async (item: ModalMenuItem, file?: File) => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      let imageUrl = item.image;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.uid}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("menu-items")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("Gagal mengupload gambar");
        }

        const { data: publicData } = supabase.storage
          .from("menu-items")
          .getPublicUrl(filePath);

        imageUrl = publicData.publicUrl;
      }

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from("item")
          .update({
            nama_item: item.name,
            harga_item: item.price,
            image: imageUrl,
          })
          .eq("id_item", item.id.toString());

        if (error) throw error;

        setMenuList((prev) =>
          prev.map((menu) =>
            menu.id_item === item.id.toString()
              ? {
                  ...menu,
                  nama_item: item.name,
                  harga_item: item.price,
                  image: imageUrl,
                }
              : menu
          )
        );
        Swal.fire("Sukses", "Menu berhasil diperbarui", "success");
      } else {
        // Add new item
        const newItemId = `ITEM-${Date.now()}`;
        const { data, error } = await supabase
          .from("item")
          .insert([
            {
              id_item: newItemId,
              nama_item: item.name,
              harga_item: item.price,
              id_toko: user.uid,
              image: imageUrl,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Merge DB data with local fields for UI since DB might not have them yet
        const localData = {
          ...data,
          image: imageUrl,
        };

        setMenuList((prev) => [...prev, localData]);
        Swal.fire("Sukses", "Menu berhasil ditambahkan", "success");
      }
      setShowMenuModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving menu:", error);
      Swal.fire("Error", "Gagal menyimpan menu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: DBMenuItem) => {
    // Map DB item to Modal item
    const modalItem: ModalMenuItem = {
      id: item.id_item, // No cast needed now
      name: item.nama_item,
      price: item.harga_item,
      image: item.image || "",
    };
    setEditingItem(modalItem);
    setShowMenuModal(true);
  };

  const handleDelete = (item: DBMenuItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const { error } = await supabase
          .from("item")
          .delete()
          .eq("id_item", itemToDelete.id_item);

        if (error) throw error;

        setMenuList((prev) =>
          prev.filter((item) => item.id_item !== itemToDelete.id_item)
        );
        Swal.fire("Sukses", "Menu berhasil dihapus", "success");
      } catch (error) {
        console.error("Error deleting menu:", error);
        Swal.fire("Error", "Gagal menghapus menu", "error");
      } finally {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-0">
      <Modal
        isOpen={showDeleteModal}
        title="Hapus Menu"
        message={`Apakah Anda yakin ingin menghapus menu "${itemToDelete?.nama_item}"?`}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        showConfirm={true}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />

      {showMenuModal && (
        <MenuModal
          isOpen={showMenuModal}
          onClose={() => {
            setShowMenuModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveMenu}
          editingItem={editingItem}
          key={editingItem ? editingItem.id : "new"}
        />
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-center text-sm font-medium text-coffee-600 mb-4">
          Promo/Informasi
        </p>
        <h2 className="text-3xl font-bold text-center text-coffee-900 mb-6">
          KELOLA TOKO
        </h2>

        {/* Add Menu Button */}
        <button
          onClick={() => {
            setEditingItem(null);
            setShowMenuModal(true);
          }}
          className="w-full py-3 bg-coffee-600 text-white font-bold rounded-xl shadow-md hover:bg-coffee-700 transition-all flex items-center justify-center mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Menu Baru
        </button>

        {/* Menu List */}
        <div className="space-y-4 mb-8">
          {loading ? (
            <p className="text-center text-coffee-500">Memuat Menu...</p>
          ) : menuList.length === 0 ? (
            <p className="text-center text-coffee-500">Belum ada menu.</p>
          ) : (
            menuList.map((item) => (
              <div
                key={item.id_item}
                className="bg-coffee-50 p-3 md:p-4 rounded-xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-coffee-200"
              >
                <div className="flex items-center space-x-3 md:space-x-4 flex-1 overflow-hidden">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-coffee-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.nama_item}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-coffee-600 font-bold text-xl">
                        {item.nama_item.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-coffee-900 text-sm md:text-base truncate">
                      {item.nama_item}
                    </h3>
                    <p className="font-bold text-coffee-600 text-sm md:text-base">
                      {formatRupiah(item.harga_item)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-2 md:ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info & Back Button */}
        <div className="mt-8 text-center">
          <button className="text-coffee-600 font-semibold hover:text-coffee-700 flex items-center justify-center mx-auto mb-6">
            Info Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex justify-center mb-4 space-x-3">
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
            <div className="w-4 h-4 bg-coffee-200 rounded-full"></div>
          </div>

          <button
            onClick={() => router.push("/dashboard/seller")}
            className="text-coffee-600 font-semibold hover:text-coffee-800 flex items-center justify-center mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
