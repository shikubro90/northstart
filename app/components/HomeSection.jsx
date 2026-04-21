// components/HomeSection.js
"use client";
import Image from "next/image";
import Navigation from "./Navigation";
import backgroundImage from "@/public/background.jpg";

export default function HomeSection() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <Navigation />

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-wide mb-4">
              Northstar
            </h1>
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-16 h-px bg-white/50"></div>
              <div className="w-8 h-px bg-white/50"></div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white/60">Scroll</span>
          <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/60 rounded-full mt-1 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}