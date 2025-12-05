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
        email: "ujang@bcfood.com",
        password: passwordHash,
        role: "PEMBELI",
        nama: "Ujang Basikal",
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

    // Seed Menu Items and Tables (Temporarily disabled as per request)
    /*
    // 1. Bungo Jaya Cafe
    const bungoJaya = seededUsers.find(
      (u) => u.email === "bungojayacafe@bcfood.com"
    );
    if (bungoJaya) {
       // ... existing item logic ...
    }
    // ... other stores and tables ...
    */

    // Return only users
    return NextResponse.json(
      {
        message: "Seeding successful (Users Only)",
        users: seededUsers,
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
