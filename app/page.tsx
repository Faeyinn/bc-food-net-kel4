"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Phone, ShoppingBag, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "./context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [showRegister, setShowRegister] = useState(false);
  // Role is now handled automatically (default Pembeli for register, checked on login)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "Pembeli", // Default role
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Mohon isi Email dan Password.",
      });
      return;
    }

    try {
      await login(formData.email, "Pembeli", formData.password);
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Email atau Password salah.",
      });
    }
  };

  const handleRegister = async () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.phone
    ) {
      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal",
        text: "Mohon lengkapi semua data pendaftaran (Nama, Email, Telepon, Password).",
      });
      return;
    }

    try {
      // Always register as Pembeli
      await register({ ...formData, role: "Pembeli" });
      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil",
        text: "Akun Anda telah berhasil dibuat. Silakan login.",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowRegister(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal",
        text: "Terjadi kesalahan saat mendaftar.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image/Branding */}
        <div className="md:w-1/2 bg-coffee-50 p-6 md:p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-4 rounded-full shadow-lg mb-4 md:mb-6">
            <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-coffee-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Business Center
          </h2>
          <h3 className="text-lg md:text-xl font-semibold text-coffee-600 mb-4">
            Food Net
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            Solusi kantin digital modern. Pesan makanan, kelola toko, dan
            nikmati kemudahan transaksi dalam satu aplikasi.
          </p>
          <div className="mt-6 md:mt-8 flex items-center space-x-2 text-gray-500 text-xs md:text-sm">
            <MapPin className="w-4 h-4" />
            <span>Universitas Andalas</span>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="md:w-1/2 p-6 md:p-12">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {showRegister ? "Daftar Akun Baru" : "Selamat Datang Kembali"}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              {showRegister
                ? "Lengkapi data diri Anda untuk memulai"
                : "Silakan masuk ke akun Anda"}
            </p>
          </div>

          <div className="space-y-4">
            {showRegister && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all text-sm md:text-base"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nomor Telepon"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all text-sm md:text-base"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-gray-800 border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all text-sm md:text-base"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 border border-gray-300 focus:ring-coffee-500 focus:border-coffee-500 outline-none transition-all text-sm md:text-base"
              />
            </div>

            <button
              onClick={showRegister ? handleRegister : handleLogin}
              className="w-full py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              {showRegister ? "Daftar Sekarang" : "Masuk"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              {showRegister ? "Sudah punya akun?" : "Belum punya akun?"}
              <button
                onClick={() => setShowRegister(!showRegister)}
                className="ml-2 text-coffee-600 font-bold hover:underline focus:outline-none"
              >
                {showRegister ? "Login" : "Daftar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
