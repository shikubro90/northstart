// components/ContactSection.jsx
"use client";

import Image from "next/image";
import Navigation from "./Navigation";
import backgroundImage from "@/public/background.jpg";

export default function ContactSection() {
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
        {/* Burgundy overlay */}
        <div className="absolute inset-0 bg-[#800020]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <Navigation />

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">

            {/* Subtle Pentagram */}
            <div className="flex justify-center mb-6 opacity-40">
              <svg
                width="28"
                height="28"
                viewBox="0 0 100 100"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polygon points="50,5 61,39 98,39 67,59 79,91 50,70 21,91 33,59 2,39 39,39" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-wide mb-4">
              Northstar
            </h1>

            {/* Divider */}
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-16 h-px bg-white/50"></div>
              <div className="w-8 h-px bg-white/50"></div>
            </div>

            {/* Contact Email */}
            <p className="text-lg md:text-xl text-white/80">
              info@nstarassoc.com
            </p>
          </div>
        </div>

        {/* Fine Print */}
        <div className="absolute bottom-4 w-full text-center text-xs text-white/50">
          2026 Northstar Associates LLC All rights reserved.
        </div>
      </div>
    </div>
  );
}