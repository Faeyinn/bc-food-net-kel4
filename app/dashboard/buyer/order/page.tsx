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
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";

interface MenuItem {
  id_item: string;
  nama_item: string;
  harga_item: number;
  image?: string;
  description?: string;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes: string;
  // Computed client-side for UI display
  category?: string;
  image?: string;
  description?: string;
}

interface DisplayMenuItem extends MenuItem {
  category: string;
  image: string; // Ensure string for display
  description: string;
}

export default function BuyerOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBuyerTransaction } = useData();
  const { user } = useAuth();

  const storeId = searchParams.get("storeId");
  const storeName = searchParams.get("storeName");
  const tableNumber = searchParams.get("tableNumber");

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [itemNotes, setItemNotes] = useState<{ [key: string]: string }>({});
  const [menuItems, setMenuItems] = useState<DisplayMenuItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  const [categories, setCategories] = useState([
    "Semua",
    "Makanan",
    "Minuman",
    "Snack",
  ]);

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
        const mappedItems = (data || []).map((item: MenuItem) => {
          // If category exists in DB, use it
          if (item.category) {
            return {
              ...item,
              category: item.category,
              image: item.image || "/api/placeholder/100/100",
              description:
                item.description ||
                "Menu lezat dari " + (storeName || "toko kami"),
            };
          }

          // Fallback to name-based categorization if missing in DB
          let category = "Makanan";
          const lowerName = item.nama_item.toLowerCase();
          if (
            lowerName.includes("es") ||
            lowerName.includes("jus") ||
            lowerName.includes("kopi") ||
            lowerName.includes("teh") ||
            lowerName.includes("minuman") ||
            lowerName.includes("air")
          ) {
            category = "Minuman";
          } else if (
            lowerName.includes("kerupuk") ||
            lowerName.includes("snack") ||
            lowerName.includes("gorengan")
          ) {
            category = "Snack";
          }

          return {
            ...item,
            category,
            image: item.image || "/api/placeholder/100/100",
            description:
              item.description ||
              "Menu lezat dari " + (storeName || "toko kami"),
          };
        });

        // Update categories list based on items found
        const uniqueCategories = Array.from(
          new Set(mappedItems.map((item) => item.category))
        );
        const defaultCategories = ["Semua", "Makanan", "Minuman", "Snack"];
        const combinedCategories = [
          "Semua",
          ...new Set([
            ...defaultCategories.filter((c) => c !== "Semua"),
            ...uniqueCategories,
          ]),
        ];

        setCategories(combinedCategories);
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

  const handleNoteChange = (itemId: string, note: string) => {
    setItemNotes((prev) => ({
      ...prev,
      [itemId]: note,
    }));
  };

  const addToCart = (item: DisplayMenuItem) => {
    const quantity = quantities[item.id_item] || 0;
    const note = itemNotes[item.id_item] || "";

    if (quantity > 0) {
      const existingItemIndex = cart.findIndex(
        (i) => i.id_item === item.id_item
      );
      if (existingItemIndex > -1) {
        const newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
        if (note) {
          newCart[existingItemIndex].notes = newCart[existingItemIndex].notes
            ? `${newCart[existingItemIndex].notes}, ${note}`
            : note;
        }
        setCart(newCart);
      } else {
        setCart([...cart, { ...item, quantity, notes: note }]);
      }
      // Reset quantity and note for this item
      setQuantities((prev) => ({ ...prev, [item.id_item]: 0 }));
      setItemNotes((prev) => ({ ...prev, [item.id_item]: "" }));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id_item !== itemId));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.harga_item * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      Swal.fire("Error", "Anda harus login untuk memesan", "error");
      return;
    }
    if (!tableNumber) {
      Swal.fire(
        "Error",
        "Nomor meja tidak ditemukan. Silakan scan ulang QR code atau pilih meja kembali.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Generate shorter IDs to fit varchar(20)
      const timestampStr = Date.now().toString().slice(-9);
      const randomSuffix = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

      // 1. Insert into Meja (Ensure table exists first)
      const { error: mejaError } = await supabase.from("meja").upsert({
        no_meja: tableNumber,
        status_meja: "TERISI",
      });

      if (mejaError) {
        console.error("Error inserting into meja:", mejaError);
        throw new Error(`Gagal update meja: ${mejaError.message}`);
      }

      // 2. Create Sesi Pemesanan
      const sessionId = `SES${timestampStr}${randomSuffix}`;
      const { error: sesiError } = await supabase
        .from("sesi_pemesanan")
        .insert({
          id_sesi: sessionId,
          no_meja: tableNumber,
          id_pelanggan: user.uid,
          tanggal_pemesanan: new Date().toISOString(),
          status_sesi: "AKTIF",
        })
        .select()
        .single();

      if (sesiError) throw sesiError;

      // 3. Create Transaksi
      const transactionId = `TRX${timestampStr}${randomSuffix}`;

      // DB constraint allows only 'TUNAI' or 'NON-TUNAI'
      // Map client payment methods to those values
      let dbJenisTransaksi = "NON-TUNAI";
      const pmUpper = String(paymentMethod || "").toUpperCase();
      if (pmUpper === "TUNAI" || pmUpper === "CASH") {
        dbJenisTransaksi = "TUNAI";
      }

      const { error: trxError } = await supabase
        .from("transaksi")
        .insert({
          id_transaksi: transactionId,
          id_sesi: sessionId,
          id_toko: storeId,
          jenis_transaksi: dbJenisTransaksi,
          total_harga: totalAmount,
          status_pesanan: "MENUNGGU",
          tanggal_transaksi: new Date().toISOString(),
        })
        .select()
        .single();

      if (trxError) throw trxError;

      // 4. Create Antrian Order (Items)
      const orderItems = cart.map((item, index) => ({
        order_line: `ORD-${transactionId}-${index + 1}`,
        id_transaksi: transactionId,
        id_item: item.id_item,
        jumlah_item: item.quantity,
        subtotal: item.harga_item * item.quantity,
        catatan: item.notes || "",
      }));

      const { error: itemsError } = await supabase
        .from("antrian_order")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success
      const transactionData = {
        id: transactionId,
        storeName: storeName || "Toko",
        tableNumber: tableNumber || "-",
        items: cart,
        totalAmount,
        status: "Menunggu Konfirmasi",
        timestamp: new Date().toLocaleString(),
        paymentMethod: paymentMethod,
      };

      setBuyerTransaction(transactionData);

      if (paymentMethod === "QRIS") {
        setShowQRModal(true);
      } else {
        router.push("/dashboard/buyer/transaction");
      }
    } catch (error: unknown) {
      console.error("Checkout Error:", error);
      let errorMessage = "Terjadi kesalahan saat memproses pesanan.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }

      if (errorMessage.includes("Could not find the 'catatan' column")) {
        errorMessage =
          "Kolom 'catatan' belum ada di database. Silakan tambahkan kolom 'catatan' (text) pada tabel 'antrian_order' di Supabase.";
      }

      Swal.fire({
        icon: "error",
        title: "Gagal Memesan",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
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
              <div className="w-20 h-20 bg-coffee-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                {item.image && item.image !== "/api/placeholder/100/100" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.nama_item}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-coffee-400 text-xs text-center p-1">
                    No Img
                  </div>
                )}
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
                <input
                  type="text"
                  placeholder="Catatan (opsional)"
                  value={itemNotes[item.id_item] || ""}
                  onChange={(e) =>
                    handleNoteChange(item.id_item, e.target.value)
                  }
                  className="w-full mt-2 px-2 py-1 text-xs text-coffee-600 border border-coffee-200 rounded-lg focus:outline-none focus:border-coffee-500 bg-coffee-50/50"
                />
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
              <div className="mb-4">
                <p className="font-semibold text-coffee-900 mb-2">
                  Metode Pembayaran
                </p>
                <div className="flex space-x-2">
                  {["QRIS", "TUNAI"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        paymentMethod === method
                          ? "bg-coffee-600 text-white border-coffee-600"
                          : "bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

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

      {/* QRIS Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-coffee-900">Pindai QRIS</h2>
              <p className="text-sm text-coffee-500">
                Total: {formatRupiah(totalAmount)}
              </p>
            </div>

            <div className="flex-1 w-full max-h-[70vh] flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/qr-amelamr.jpg"
                alt="QRIS Payment"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full max-w-xs space-y-3 mt-6 pb-6">
              <button
                onClick={() => router.push("/dashboard/buyer/transaction")}
                className="w-full py-4 bg-coffee-600 text-white font-bold rounded-xl shadow-lg hover:bg-coffee-700 transition-all active:scale-[0.98]"
              >
                Sudah Bayar
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-3 bg-transparent text-coffee-600 font-semibold rounded-xl border border-coffee-200 hover:bg-coffee-50 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
