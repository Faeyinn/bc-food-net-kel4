"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRupiah } from "../../../utils/format";
import { useData } from "../../../context/DataContext";
import { supabase } from "@/app/lib/supabase";

interface MenuItem {
  id_item: string;
  nama_item: string;
  harga_item: number;
  // Optional fields for UI compatibility
  image?: string;
  description?: string;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes: string;
}

export default function BuyerOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBuyerTransaction } = useData();

  const storeId = searchParams.get("storeId");
  const storeName = searchParams.get("storeName");
  const tableNumber = searchParams.get("tableNumber");

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Semua", "Makanan", "Minuman", "Snack"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!storeId) return;

      try {
        const { data, error } = await supabase
          .from("item")
          .select("*")
          .eq("id_toko", storeId);

        if (error) throw error;

        // Map and categorize items
        const mappedItems = (data || []).map((item: any) => {
          let category = "Makanan";
          const lowerName = item.nama_item.toLowerCase();
          if (
            lowerName.includes("es") ||
            lowerName.includes("jus") ||
            lowerName.includes("kopi") ||
            lowerName.includes("teh") ||
            lowerName.includes("minuman")
          ) {
            category = "Minuman";
          } else if (
            lowerName.includes("kerupuk") ||
            lowerName.includes("snack")
          ) {
            category = "Snack";
          }

          return {
            ...item,
            category,
            image: "/api/placeholder/100/100",
            description: "Menu lezat dari " + (storeName || "toko kami"),
          };
        });

        setMenuItems(mappedItems);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [storeId, storeName]);

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id_item] || 0;
    if (quantity > 0) {
      const existingItemIndex = cart.findIndex(
        (i) => i.id_item === item.id_item
      );
      if (existingItemIndex > -1) {
        const newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
        setCart(newCart);
      } else {
        setCart([...cart, { ...item, quantity, notes: "" }]);
      }
      // Reset quantity for this item
      setQuantities((prev) => ({ ...prev, [item.id_item]: 0 }));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id_item !== itemId));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.harga_item * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const currentTimestamp = Date.now();
    const transactionData = {
      id: `TRX-${currentTimestamp}`,
      storeName: storeName || "Toko",
      tableNumber: tableNumber || "-",
      items: cart,
      totalAmount,
      status: "Menunggu Konfirmasi",
      timestamp: new Date().toLocaleString(),
      paymentMethod: "QRIS", // Default
    };

    setBuyerTransaction(transactionData);
    router.push("/dashboard/buyer/transaction");
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch = item.nama_item
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-md mx-auto p-4 md:p-0 pb-24">
      {/* Header */}
      <div className="bg-white rounded-b-2xl shadow-sm sticky top-0 z-10 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-coffee-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-coffee-800" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-lg text-coffee-900">
              {storeName || "Menu Toko"}
            </h1>
            <p className="text-xs text-coffee-500">
              Meja: {tableNumber || "-"}
            </p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="p-2 hover:bg-coffee-50 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-6 h-6 text-coffee-800" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-coffee-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-coffee-600 text-white"
                  : "bg-coffee-50 text-coffee-600 hover:bg-coffee-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-coffee-500">Memuat Menu...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-coffee-500">Menu tidak ditemukan.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id_item}
              className="bg-white p-4 rounded-xl shadow-sm flex space-x-4 border border-coffee-50"
            >
              <div className="w-20 h-20 bg-coffee-100 rounded-lg flex-shrink-0">
                {/* Image placeholder */}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-coffee-900">
                  {item.nama_item}
                </h3>
                <p className="text-xs text-coffee-500 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <p className="font-bold text-coffee-600">
                  {formatRupiah(item.harga_item)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center space-x-2 bg-coffee-50 rounded-lg p-1">
                  <button
                    onClick={() => handleQuantityChange(item.id_item, -1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4 text-coffee-600" />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center text-coffee-900">
                    {quantities[item.id_item] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id_item, 1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-coffee-600" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-2 px-3 py-1 bg-coffee-600 text-white text-xs font-bold rounded-lg hover:bg-coffee-700 transition-colors"
                >
                  Tambah
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Bottom Sheet (Simplified) */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-coffee-900">
                Pesanan Anda
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-coffee-50 rounded-full"
              >
                <X className="w-6 h-6 text-coffee-500" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-coffee-500">
                Keranjang masih kosong
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id_item}
                    className="flex justify-between items-start border-b border-coffee-100 pb-4"
                  >
                    <div>
                      <h3 className="font-semibold text-coffee-900">
                        {item.nama_item}
                      </h3>
                      <p className="text-sm text-coffee-500">
                        {item.quantity} x {formatRupiah(item.harga_item)}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-coffee-400 mt-1">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-coffee-900">
                        {formatRupiah(item.harga_item * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id_item)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-coffee-200 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-coffee-900">
                  Total Pembayaran
                </span>
                <span className="font-bold text-xl text-coffee-600">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 bg-coffee-600 text-white font-bold rounded-xl shadow-lg hover:bg-coffee-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button if Cart not shown */}
      {!showCart && cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-coffee-600 text-white py-4 rounded-xl shadow-lg flex items-center justify-between px-6 hover:bg-coffee-700 transition-all"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold">{cart.length} Item</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">{formatRupiah(totalAmount)}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
