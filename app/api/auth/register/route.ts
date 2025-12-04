import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Insert into users table
    // Note: role is passed from frontend (default "Pembeli")
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          nama: name,
          email,
          password: hashedPassword,
          no_hp: phone,
          role: role.toUpperCase(), // Ensure uppercase for ENUM
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: { ...newUser, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
