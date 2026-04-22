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
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToSection = (index) => {
    if (!wrapperRef.current) return;
    if (index < 0 || index >= SECTION_COUNT) return;
    
    // On mobile, native smooth scroll
    if (isMobileRef.current) {
      setActiveIndex(index);
      currentIndexRef.current = index;
      setIsMenuOpen(false);
      const section = document.getElementById(`section-${index}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

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
      if (isMobileRef.current || isAnimatingRef.current) return;

      if (e.deltaY > 0) goToSection(currentIndexRef.current + 1);
      else goToSection(currentIndexRef.current - 1);
    };

    const handleTouchStart = (e) => {
      if (isMobileRef.current) return;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (isMobileRef.current) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSection(currentIndexRef.current + 1);
        else goToSection(currentIndexRef.current - 1);
      }
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;

      if (mobile) {
        gsap.set(wrapperRef.current, { x: 0 });
      } else {
        gsap.set(wrapperRef.current, {
          x: -currentIndexRef.current * window.innerWidth,
        });
      }
    };

    // Initial check
    handleResize();

    // Mobile scroll tracking
    const handleScroll = () => {
      if (!isMobileRef.current || !wrapperRef.current) return;
      const scrollY = wrapperRef.current.parentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollY / windowHeight);
      
      if (newIndex !== currentIndexRef.current && newIndex >= 0 && newIndex < SECTION_COUNT) {
        setActiveIndex(newIndex);
        currentIndexRef.current = newIndex;
      }
    };

    const parentEl = wrapperRef.current?.parentElement;
    if (parentEl) {
      parentEl.addEventListener("scroll", handleScroll, { passive: true });
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      if (parentEl) {
        parentEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const navItems = ["Home", "About", "Contact"];

  return (
    <div className={`relative h-[100dvh] w-screen bg-black text-white ${isMobile ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}`}>
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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
          className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${activeIndex === 0 ? "opacity-100" : "opacity-0"
            }`}
        ></div>
        {/* Burgundy overlay for About & Contact */}
        <div
          className={`absolute inset-0 bg-[#800020]/75 transition-opacity duration-700 ${activeIndex > 0 ? "opacity-100" : "opacity-0"
            }`}
        ></div>
      </div>

      {/* Navigation Bar */}
      <nav 
        className="fixed top-8 left-0 w-full z-[60] flex items-center justify-between pointer-events-none"
        style={{ paddingLeft: 'max(2rem, 8vw)', paddingRight: 'max(2rem, 8vw)' }}
      >
        {/* Logo */}
        <div className="text-lg md:text-xl font-light tracking-[0.15em] text-white/90 pointer-events-auto">
          Northstar
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button 
          className="md:hidden text-white pointer-events-auto transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-10 pointer-events-auto">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => goToSection(index)}
              className={`text-[12px] tracking-[0.2em] uppercase transition-all duration-300 relative ${activeIndex === index
                ? "text-white"
                : "text-white/50 hover:text-white/80"
                }`}
            >
              {item}
              {/* Active underline */}
              <span
                className={`absolute left-0 -bottom-1 h-px bg-white transition-all duration-300 ${activeIndex === index ? "w-full" : "w-0"
                  }`}
              />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0F172A] z-50 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden flex flex-col items-center justify-center`}
      >
        <div className="flex flex-col gap-12 items-center">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => goToSection(index)}
              className="text-2xl tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Content Wrapper */}
      <div
        ref={wrapperRef}
        className={`relative z-10 flex ${isMobile ? "flex-col w-full" : "h-full will-change-transform"}`}
        style={!isMobile ? { width: `${SECTION_COUNT * 100}vw` } : {}}
      >
        {/* Home Section */}
        <section id="section-0" className={`w-full ${isMobile ? "min-h-[100dvh]" : "w-screen h-full"} flex flex-col items-center justify-center relative px-4`}>
          <div className="text-center mt-10 md:mt-0">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-light tracking-wide mb-6">
              Northstar
            </h1>
            <div className="flex justify-center gap-3">
              <div className="w-16 md:w-20 h-px bg-white/60"></div>
              <div className="w-6 md:w-8 h-px bg-white/60"></div>
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
        <section id="section-1" className={`w-full ${isMobile ? "min-h-[100dvh] py-24" : "w-screen h-full"} flex flex-col items-center justify-center px-6 md:px-20 text-center`}>
          <div className="max-w-[900px] mx-auto mt-10 md:mt-0">
            <p className="text-xl sm:text-[26px] md:text-3xl lg:text-[40px] font-light leading-snug mb-10 text-white/95">
              Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.
            </p>
            <p className="text-xs sm:text-sm md:text-[15px] font-normal tracking-widest text-white/70 uppercase">
              Accredited investors only.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="section-2" className={`w-full ${isMobile ? "min-h-[100dvh] py-24" : "w-screen h-full"} flex flex-col items-center justify-center relative px-4 text-center`}>
          <div className="flex flex-col items-center mt-10 md:mt-0">
            {/* Star Icon */}
            <div className="mb-6 opacity-60">
              <svg
                width="30"
                height="30"
                className="md:w-[36px] md:h-[36px]"
                viewBox="0 0 100 100"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polygon points="50,5 61,39 98,39 67,59 79,91 50,70 21,91 33,59 2,39 39,39" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-light tracking-wide mb-6">
              Northstar
            </h1>

            {/* Divider */}
            <div className="flex justify-center gap-3 mb-8">
              <div className="w-16 md:w-20 h-px bg-white/60"></div>
              <div className="w-6 md:w-8 h-px bg-white/60"></div>
            </div>

            {/* Email */}
            <p className="text-lg sm:text-xl md:text-2xl font-light tracking-wide text-white/90">
              info@nstarassoc.com
            </p>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-8 md:bottom-10 w-full text-center text-[10px] sm:text-xs tracking-wider text-white/50 px-4">
            2026 Northstar Associates LLC All rights reserved.
          </div>
        </section>
      </div>
    </div>
  );
}
