"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InfoBCPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Image */}
        <div className="w-full h-48 relative">
          <Image
            src="/bc-unand.jpg"
            alt="BC Unand"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header */}
        <div className="bg-coffee-600 p-6 text-white relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-6 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center mt-2">
            <h1 className="text-2xl font-bold">Business Center</h1>
            <p className="text-coffee-100 text-sm">Universitas Andalas</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* About Section */}
          <section>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
              Business Center Universitas Andalas adalah sebuah tempat pusat
              kegiatan kuliner utama bagi mahasiswa di lingkungan Universitas
              Andalas yang terdapat berbagai macam kebutuhan. salah satunya
              pusat kuliner yang terdapat berbagai toko makanan dan minuman, di
              dalam berbagai toko yang berbeda. Toko makanan menjadi salah satu
              solusi utama dalam memenuhi kebutuhan utama, baik untuk konsumsi
              untuk sarapan, istirahat (makan siang) maupun dalam sehari hari.
              Business Center Unand ini terletak di area yang ramai dan mudah
              dijangkau, serta adanya berbagai toko makanan dan minuman dalam
              Business Center ini mampu dijangkau oleh berbagai macam pelanggan
              seperti masyarakat sekitar dan yang paling utama yaitu mahasiswa
              Unand itu sendiri.
              <br />
              <br />
              <h2 className="text-xl font-bold text-coffee-800 mb-4 border-b border-gray-100 pb-2">
                Tentang Kami
              </h2>
              Website BC FOOD NET dikembangkan oleh NEXADEV STUDIO (Kelompok 4)
              sebagai bagian dari project mata kuliah Rekayasa Perangkat Lunak.
            </p>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-lg font-bold text-coffee-800 mb-4 border-b border-gray-100 pb-2">
              Anggota Kelompok
            </h2>
            <ul className="space-y-2">
              {[
                { name: "M Wahyu Faturrahman", id: "2211513040" },
                { name: "Mifta Riri Amela", id: "2311511012" },
                { name: "Haya Al Fitrah", id: "2311512002" },
                { name: "Muhammad Shadiq", id: "2311513014" },
                { name: "Andi Tri Akira", id: "2311513022" },
                { name: "Novalino", id: "2311513038" },
              ].map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm md:text-base p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    {member.name}
                  </span>
                  <span className="text-coffee-600 font-medium">
                    {member.id}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-bold text-coffee-800 mb-4 border-b border-gray-100 pb-2">
              Hubungi Kami
            </h2>
            <div className="space-y-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/6282390658106"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="mr-4 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                  <p className="text-sm text-green-600">+62 823-9065-8106</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/nexa.devrpl4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group"
              >
                <div className="mr-4 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-8 h-8">
                    <radialGradient
                      id="rg"
                      r="150%"
                      cx="30%"
                      cy="107%"
                      fx="30%"
                      fy="107%"
                    >
                      <stop stopColor="#fdf497" offset="0" />
                      <stop stopColor="#fdf497" offset="0.05" />
                      <stop stopColor="#fd5949" offset="0.45" />
                      <stop stopColor="#d6249f" offset="0.6" />
                      <stop stopColor="#285AEB" offset="0.9" />
                    </radialGradient>
                    <path
                      fill="url(#rg)"
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Instagram</h3>
                  <p className="text-sm text-pink-600">@nexa.devrpl4</p>
                </div>
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="font-bold text-gray-700 text-xs md:text-sm">
            © 2025 BC UNAND
          </p>
          <p className="text-gray-500 text-xs">
            Developed by NEXADEV STUDIO — Kelompok 4
          </p>
        </div>
      </div>
    </div>
  );
}
