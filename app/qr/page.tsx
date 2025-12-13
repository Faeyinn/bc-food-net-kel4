"use client";

import React, { useRef } from "react";
import { ShoppingBag, MapPin, Download } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

export default function QRPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        });
        const link = document.createElement("a");
        link.download = "bcfoodnet-qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Download failed", error);
        alert("Gagal mendownload gambar. Coba lagi.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background with Premium Overlay */}
      <div
        className="absolute inset-0 z-0 scale-105 blur-sm"
        style={{
          backgroundImage: "url('/unandbakti25.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-coffee-900/40 backdrop-blur-sm"></div>
      </div>

      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-coffee-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Glass Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center animate-fade-in-up"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header / Brand Section */}
        <div className="w-full pt-10 pb-6 px-8 flex flex-col items-center text-center relative">
          <div
            className="absolute top-0 inset-x-0 h-32"
            style={{
              background:
                "linear-gradient(to bottom, rgba(45, 26, 11, 0.8), transparent)",
              opacity: 0.5,
            }}
          ></div>

          <div
            className="relative p-4 mb-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <ShoppingBag
              className="w-8 h-8 drop-shadow-md"
              style={{ color: "#ffffff" }}
            />
          </div>

          <h1
            className="text-3xl font-bold tracking-tight drop-shadow-lg mb-1"
            style={{ color: "#ffffff" }}
          >
            Business Center
          </h1>
          <p
            className="text-lg font-medium tracking-widest uppercase drop-shadow-sm"
            style={{ color: "#f5efe9", opacity: 0.9 }}
          >
            Food Net
          </p>
        </div>

        {/* QR Section */}
        <div className="w-full px-8 py-4 flex flex-col items-center">
          {/* Viewfinder Container */}
          <div className="relative p-6 mb-8 group">
            {/* Corner Markers */}
            <div
              className="absolute top-0 left-0 w-8 h-8 rounded-tl-xl filter drop-shadow-lg"
              style={{
                borderTop: "4px solid rgba(255, 255, 255, 0.8)",
                borderLeft: "4px solid rgba(255, 255, 255, 0.8)",
              }}
            ></div>
            <div
              className="absolute top-0 right-0 w-8 h-8 rounded-tr-xl filter drop-shadow-lg"
              style={{
                borderTop: "4px solid rgba(255, 255, 255, 0.8)",
                borderRight: "4px solid rgba(255, 255, 255, 0.8)",
              }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-xl filter drop-shadow-lg"
              style={{
                borderBottom: "4px solid rgba(255, 255, 255, 0.8)",
                borderLeft: "4px solid rgba(255, 255, 255, 0.8)",
              }}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-8 h-8 rounded-br-xl filter drop-shadow-lg"
              style={{
                borderBottom: "4px solid rgba(255, 255, 255, 0.8)",
                borderRight: "4px solid rgba(255, 255, 255, 0.8)",
              }}
            ></div>

            {/* QR Background & Image */}
            <div
              className="relative p-3 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.2)] animate-float"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <Image
                  src="/bcfoodnet_qr.png"
                  alt="QR Code"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full pb-8 pt-4 px-6 flex flex-col items-center">
          <div
            className="w-full h-px mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          ></div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="flex items-center gap-2"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              <MapPin
                className="w-4 h-4 drop-shadow-md"
                style={{ color: "#fb923c" }}
              />
              <span className="font-semibold tracking-wide text-sm drop-shadow-sm">
                Universitas Andalas
              </span>
            </div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-light"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              Premium Digital Canteen
            </p>
          </div>
        </div>
      </div>

      {/* Floating Download Button */}
      <button
        onClick={handleDownload}
        className="fixed bottom-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all group"
        title="Download QR Card"
      >
        <Download className="w-6 h-6 group-hover:animate-bounce" />
      </button>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
