// components/AboutSection.js
"use client";
import Navigation from "./Navigation";
import backgroundImage from "@/public/background.jpg";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          className="object-cover"
          quality={100}
        />
        {/* Burgundy overlay for 2nd page */}
        <div className="absolute inset-0 bg-[#800020]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <Navigation />

        <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-6">
            Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.
          </p>
          <p className="text-sm md:text-base font-light tracking-wide text-white/70 uppercase">
            Accredited investors only.
          </p>
        </div>
      </div>
    </div>
  );
}