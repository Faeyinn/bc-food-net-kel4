import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("123456", 10);

    const users = [
      {
        email: "admin@bcfood.com",
        password: passwordHash,
        role: "ADMIN",
        nama: "Administrator",
        no_hp: "081234567890",
      },
      {
        email: "bungojayacafe@bcfood.com",
        password: passwordHash,
        role: "PENJUAL",
        nama: "Bungo Jaya Cafe",
        no_hp: "081234567891",
        jenis_toko: "Cafe",
      },
      {
        email: "amperakaramuntiang@bcfood.com",
        password: passwordHash,
        role: "PENJUAL",
        nama: "Ampera Karamuntiang",
        no_hp: "081234567893",
        jenis_toko: "Ampera",
      },
      {
        email: "khanzacafe@bcfood.com",
        password: passwordHash,
        role: "PENJUAL",
        nama: "Khanza Cafe",
        no_hp: "081234567894",
        jenis_toko: "Cafe",
      },
      {
        email: "buyer@bcfood.com",
        password: passwordHash,
        role: "PEMBELI",
        nama: "Budi Santoso",
        no_hp: "081234567892",
      },
    ];

    const { data: seededUsers, error: userError } = await supabase
      .from("users")
      .upsert(users, { onConflict: "email" })
      .select();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Seed Menu Items
    // 1. Bungo Jaya Cafe
    const bungoJaya = seededUsers.find(
      (u) => u.email === "bungojayacafe@bcfood.com"
    );
    if (bungoJaya) {
      const items = [
        {
          id_item: "BJ-001",
          nama_item: "Chicken Katsu",
          harga_item: 13000,
          id_toko: bungoJaya.id_user,
        },
        {
          id_item: "BJ-002",
          nama_item: "Chicken Vietnam",
          harga_item: 13000,
          id_toko: bungoJaya.id_user,
        },
        {
          id_item: "BJ-003",
          nama_item: "Pecel Ayam",
          harga_item: 13000,
          id_toko: bungoJaya.id_user,
        },
        {
          id_item: "BJ-004",
          nama_item: "Nasi Goreng",
          harga_item: 10000,
          id_toko: bungoJaya.id_user,
        },
        {
          id_item: "BJ-005",
          nama_item: "Mie Rebus",
          harga_item: 10000,
          id_toko: bungoJaya.id_user,
        },
        {
          id_item: "BJ-006",
          nama_item: "Mie Goreng",
          harga_item: 10000,
          id_toko: bungoJaya.id_user,
        },
      ];
      await supabase.from("item").upsert(items, { onConflict: "id_item" });
    }

    // 2. Khanza Cafe
    const khanza = seededUsers.find((u) => u.email === "khanzacafe@bcfood.com");
    if (khanza) {
      const items = [
        {
          id_item: "KC-001",
          nama_item: "Cappucino Cincau",
          harga_item: 7000,
          id_toko: khanza.id_user,
        },
        {
          id_item: "KC-002",
          nama_item: "Teh Es",
          harga_item: 4000,
          id_toko: khanza.id_user,
        },
        {
          id_item: "KC-003",
          nama_item: "Kopi Susu",
          harga_item: 6000,
          id_toko: khanza.id_user,
        },
        {
          id_item: "KC-004",
          nama_item: "Jus Alpukat",
          harga_item: 8000,
          id_toko: khanza.id_user,
        },
        {
          id_item: "KC-005",
          nama_item: "Jus Mangga",
          harga_item: 11000,
          id_toko: khanza.id_user,
        },
      ];
      await supabase.from("item").upsert(items, { onConflict: "id_item" });
    }

    // 3. Ampera Karamuntiang
    const ampera = seededUsers.find(
      (u) => u.email === "amperakaramuntiang@bcfood.com"
    );
    if (ampera) {
      const items = [
        {
          id_item: "AK-001",
          nama_item: "Nasi Ampera",
          harga_item: 12000,
          id_toko: ampera.id_user,
        },
        {
          id_item: "AK-002",
          nama_item: "Ayam Geprek",
          harga_item: 13000,
          id_toko: ampera.id_user,
        },
        {
          id_item: "AK-003",
          nama_item: "Nasi Soto",
          harga_item: 10000,
          id_toko: ampera.id_user,
        },
        {
          id_item: "AK-004",
          nama_item: "Nasi Sup Ayam",
          harga_item: 12000,
          id_toko: ampera.id_user,
        },
        {
          id_item: "AK-005",
          nama_item: "Mi Goreng",
          harga_item: 10000,
          id_toko: ampera.id_user,
        },
      ];
      await supabase.from("item").upsert(items, { onConflict: "id_item" });
    }

    // Fetch all items to confirm seeding
    const { data: allItems } = await supabase.from("item").select("*");

    return NextResponse.json(
      {
        message: "Seeding successful (Users & Menu Items)",
        users: seededUsers,
        items: allItems,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
