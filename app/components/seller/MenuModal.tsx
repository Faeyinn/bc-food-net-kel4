"use client";

import React, { useState } from "react";
import { X, Upload, ChevronDown } from "lucide-react";

export interface MenuItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem, file?: File) => void;
  editingItem: MenuItem | null;
}

const CATEGORIES = ["Makanan", "Minuman", "Snack", "Spesial", "Lainnya"];

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    price: editingItem?.price.toString() || "",
    category: editingItem?.category || "Makanan",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    editingItem?.image || ""
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto maksimal 2MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) newErrors.name = "Nama menu wajib diisi";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Harga tidak valid";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        id: editingItem ? editingItem.id : Date.now(),
        name: formData.name.trim(),
        price: parseInt(formData.price),
        image: previewUrl, // Use preview URL temporarily if new file, or existing
        category: formData.category,
      },
      selectedFile || undefined
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {editingItem
                ? "Perbarui detail menu Anda"
                : "Tambahkan menu lezat ke toko Anda"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Tabs for future if we want to split Details and Image upload visually
              For now keeping it single view but prepped layout */}
          <div className="space-y-5">
            {/* Image Placeholder - Visual cue for future implementation */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-coffee-400 transition-colors cursor-pointer group overflow-hidden relative"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              {previewUrl && previewUrl !== "/api/placeholder/100/100" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-coffee-500" />
                  </div>
                  <span className="text-sm font-medium">
                    Klik untuk upload foto menu
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    (Maksimal 2MB)
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Menu */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Menu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Contoh: Nasi Goreng Spesial"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-coffee-500 focus:border-coffee-500"
                  } outline-none transition-all placeholder:text-gray-400`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Harga */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    Rp
                  </span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.price
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-coffee-500 focus:border-coffee-500"
                    } outline-none transition-all`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none appearance-none bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-coffee-600 text-white font-semibold rounded-xl hover:bg-coffee-700 active:scale-95 transition-all shadow-md shadow-coffee-200 flex items-center text-sm"
          >
            {editingItem ? "Simpan Perubahan" : "Tambah Menu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
