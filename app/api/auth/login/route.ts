import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body; // Role is optional now for login, but we can check it if provided

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan Password harus diisi" },
        { status: 400 }
      );
    }

    // Query user from 'users' table
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.log("Login failed: User not found or DB error", error);
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    console.log("User found:", user.email);
    // console.log("Stored Hash:", user.password); // Security risk to log hash in prod, but ok for debug

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    const userData = {
      uid: user.id_user,
      email: user.email,
      name: user.nama,
      role: user.role, // "ADMIN", "PENJUAL", "PEMBELI"
      phone: user.no_hp,
      isDemo: false,
    };

    return NextResponse.json(
      { message: "Login berhasil", user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
