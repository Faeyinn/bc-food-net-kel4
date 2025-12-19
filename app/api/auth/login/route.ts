import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Login: Failed to parse JSON body", parseError);
      return NextResponse.json(
        { message: "Format request tidak valid (harap kirim JSON)" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan Password harus diisi" },
        { status: 400 }
      );
    }

    console.log(`[Login] Attempting login for email: ${email}`);

    // Query user from 'users' table
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("[Login] Supabase error during user lookup:", error);
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json(
          { message: "User tidak ditemukan" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { message: "Gagal menghubungkan ke database" },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("[Login] User not found in database");
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    console.log(`[Login] User found: ${user.email}, comparing password...`);

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[Login] Password valid: ${isPasswordValid}`);

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

    console.log(`[Login] Login successful for: ${email}`);

    return NextResponse.json(
      { message: "Login berhasil", user: userData },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Login] Internal Server Error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server", error: err.message },
      { status: 500 }
    );
  }
}
