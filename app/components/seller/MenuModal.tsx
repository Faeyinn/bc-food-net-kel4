"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  editingItem: MenuItem | null;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [menuName, setMenuName] = useState(editingItem ? editingItem.name : "");
  const [menuPrice, setMenuPrice] = useState(
    editingItem ? editingItem.price.toString() : ""
  );

  const handleSave = () => {
    if (menuName.trim() && Number(menuPrice) > 0) {
      onSave({
        ...editingItem,
        id: editingItem ? editingItem.id : Date.now(),
        name: menuName.trim(),
        price: parseInt(menuPrice),
        image: editingItem?.image || "/api/placeholder/100/100",
        category: editingItem?.category || "Makanan",
        description: editingItem?.description || "",
      });
      onClose();
    } else {
      // Menggunakan Modal custom, bukan alert()
      // Note: Di ManageStore sudah ada Modal untuk Delete, tapi di sini saya biarkan alert untuk menghindari duplikasi modal state.
      // Jika ingin sempurna, state modal harus dibawa ke ManageStore.
      alert("Nama Menu dan Harga harus diisi dengan benar.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nama Menu (contoh: Nasi Goreng)"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none"
            />
            <input
              type="number"
              placeholder="Harga (contoh: 15000)"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-coffee-600 text-white font-semibold rounded-lg hover:bg-coffee-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
