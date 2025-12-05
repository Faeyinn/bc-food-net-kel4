"use client";

import React, { createContext, useContext, useState } from "react";

interface Order {
  id: number;
  name: string;
  table: number;
  total: number;
  status: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    notes: string;
  }[];
}

interface TransactionItem {
  id_item: string;
  nama_item: string;
  harga_item: number;
  quantity: number;
  notes: string;
  image?: string;
  category?: string;
  description?: string;
}

interface BuyerTransaction {
  id: string;
  storeName: string;
  tableNumber: string;
  items: TransactionItem[];
  totalAmount: number;
  status: string;
  timestamp: string;
  paymentMethod: string;
}

interface DataContextType {
  sellerOrders: Order[];
  updateSellerOrders: (orderId: number, newStatus: string) => void;
  buyerTransaction: BuyerTransaction | null;
  setBuyerTransaction: (transaction: BuyerTransaction | null) => void;
}

const DataContext = createContext<DataContextType>({
  sellerOrders: [],
  updateSellerOrders: () => {},
  buyerTransaction: null,
  setBuyerTransaction: () => {},
});

export const useData = () => useContext(DataContext);

const initialMockOrders = [
  {
    id: 1,
    name: "Amelia",
    table: 15,
    total: 39000,
    status: "Proses",
    items: [
      {
        name: "Nasi Goreng Special",
        price: 12000,
        quantity: 2,
        notes: "Pedas",
      },
      { name: "Es Teh Manis", price: 5000, quantity: 3, notes: "Less sugar" },
    ],
  },
  {
    id: 2,
    name: "Budi",
    table: 7,
    total: 22000,
    status: "Belum Selesai",
    items: [
      { name: "Mie Ayam Jumbo", price: 12000, quantity: 1, notes: "" },
      { name: "Soto Padang", price: 10000, quantity: 1, notes: "Tanpa bawang" },
    ],
  },
  {
    id: 3,
    name: "Citra",
    table: 22,
    total: 60000,
    status: "Selesai",
    items: [
      { name: "Ayam Geprek", price: 13000, quantity: 4, notes: "" },
      { name: "Kopi Susu", price: 8000, quantity: 1, notes: "Dingin" },
    ],
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sellerOrders, setSellerOrders] = useState<Order[]>(initialMockOrders);
  const [buyerTransaction, setBuyerTransaction] =
    useState<BuyerTransaction | null>(null);

  const updateSellerOrders = (orderId: number, newStatus: string) => {
    setSellerOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        sellerOrders,
        updateSellerOrders,
        buyerTransaction,
        setBuyerTransaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
