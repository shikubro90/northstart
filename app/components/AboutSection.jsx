// components/AboutSection.js
"use client";
import Navigation from "./Navigation";
import backgroundImage from "@/public/background.jpg";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          className="object-cover object-center brightness-110 contrast-105 saturate-110"
          quality={100}
        />
        {/* Burgundy overlay for 2nd page */}
        <div className="absolute inset-0 bg-[#A8415B]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <Navigation />

        <div className="flex-1 flex flex-col items-center justify-center px-14 md:px-4 max-w-4xl mx-auto text-center">
          <p className="text-[24px] sm:text-[26px] md:text-[30px] font-light leading-[1.65] md:leading-[1.75] mb-2">
            Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. markets.
          </p>
          <p className="text-[24px] sm:text-[26px] md:text-[30px] font-light leading-[1.65] md:leading-[1.75] text-white">
            Accredited investors only.
          </p>
        </div>
      </div>
    </div>
  );
}
