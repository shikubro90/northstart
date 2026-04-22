"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import backgroundImage from "@/public/background.jpg";

const SECTION_COUNT = 3;

export default function Slider() {
  const wrapperRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSection = (index) => {
    if (!wrapperRef.current) return;
    if (index < 0 || index >= SECTION_COUNT) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    currentIndexRef.current = index;
    setActiveIndex(index);

    gsap.to(wrapperRef.current, {
      x: -index * window.innerWidth,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  };

  useEffect(() => {
    let startX = 0;

    const handleWheel = (e) => {
      if (isAnimatingRef.current) return;

      if (e.deltaY > 0) goToSection(currentIndexRef.current + 1);
      else goToSection(currentIndexRef.current - 1);
    };

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSection(currentIndexRef.current + 1);
        else goToSection(currentIndexRef.current - 1);
      }
    };

    const handleResize = () => {
      gsap.set(wrapperRef.current, {
        x: -currentIndexRef.current * window.innerWidth,
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = ["Home", "About", "Contact"];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* Fixed Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Dark overlay for Home readability */}
        <div 
          className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${
            activeIndex === 0 ? "opacity-100" : "opacity-0"
          }`}
        ></div>
        {/* Burgundy overlay for About & Contact */}
        <div 
          className={`absolute inset-0 bg-[#800020]/75 transition-opacity duration-700 ${
            activeIndex > 0 ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 px-8 md:px-16 pt-2 flex justify-between items-center pointer-events-none">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-normal tracking-wider pointer-events-auto">
          Northstar
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-10 pointer-events-auto">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => goToSection(index)}
              className={`text-[13px] uppercase tracking-widest transition-all duration-300 border-b pb-1 ${
                activeIndex === index
                  ? "text-white border-white"
                  : "text-white/60 border-transparent hover:text-white/90"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Scrolling Content Wrapper */}
      <div 
        ref={wrapperRef}
        className="relative z-10 flex h-full will-change-transform"
        style={{ width: `${SECTION_COUNT * 100}vw` }}
      >
        {/* Home Section */}
        <section className="w-screen h-full flex flex-col items-center justify-center relative px-4">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl lg:text-[9rem] font-light tracking-wide mb-6">
              Northstar
            </h1>
            <div className="flex justify-center gap-3">
              <div className="w-20 h-px bg-white/60"></div>
              <div className="w-8 h-px bg-white/60"></div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">Scroll</span>
            <div className="w-[22px] h-[34px] border border-white/50 rounded-full flex justify-center p-1">
              <div className="w-1 h-[6px] bg-white rounded-full animate-bounce mt-1"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="w-screen h-full flex flex-col items-center justify-center px-6 md:px-20 text-center">
          <div className="max-w-[900px] mx-auto">
            <p className="text-[26px] md:text-3xl lg:text-[40px] font-light leading-snug mb-10 text-white/95">
              Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.
            </p>
            <p className="text-sm md:text-[15px] font-normal tracking-widest text-white/70 uppercase">
              Accredited investors only.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-screen h-full flex flex-col items-center justify-center relative px-4 text-center">
          <div className="flex flex-col items-center">
            {/* Star Icon */}
            <div className="mb-6 opacity-60">
              <svg
                width="36"
                height="36"
                viewBox="0 0 100 100"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polygon points="50,5 61,39 98,39 67,59 79,91 50,70 21,91 33,59 2,39 39,39" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-7xl md:text-8xl lg:text-[9rem] font-light tracking-wide mb-6">
              Northstar
            </h1>

            {/* Divider */}
            <div className="flex justify-center gap-3 mb-8">
              <div className="w-20 h-px bg-white/60"></div>
              <div className="w-8 h-px bg-white/60"></div>
            </div>

            {/* Email */}
            <p className="text-xl md:text-2xl font-light tracking-wide text-white/90">
              info@nstarassoc.com
            </p>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-10 w-full text-center text-xs tracking-wider text-white/50">
            2026 Northstar Associates LLC All rights reserved.
          </div>
        </section>
      </div>
    </div>
  );
}
