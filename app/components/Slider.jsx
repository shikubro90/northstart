"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import backgroundImage from "@/public/background.jpg";

const SECTION_COUNT = 3;

export default function Slider() {
  const scrollContainerRef = useRef(null);
  const panel1Ref = useRef(null); // About — desktop fixed overlay
  const panel2Ref = useRef(null); // Contact — desktop fixed overlay
  const burgundyOverlayRef = useRef(null);
  const darkOverlayRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobileRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOverlayRef = useRef(null);
  const menuItemRefs = useRef([]);

  const panelRefs = [panel1Ref, panel2Ref];

  const goToSection = (index) => {
    if (index < 0 || index >= SECTION_COUNT) return;

    // ── Mobile: native scroll ──────────────────────────────────
    if (isMobileRef.current) {
      setIsMenuOpen(false);
      const el = document.getElementById(`section-${index}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // ── Desktop: panel slide ───────────────────────────────────
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    currentIndexRef.current = index;
    setActiveIndex(index);

    // Each panel slides in (x=0) if its section index ≤ target, else slides out (x=100%)
    panelRefs.forEach((ref, i) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        x: i + 1 <= index ? "0%" : "100%",
        duration: 0.85,
        ease: "power2.inOut",
      });
    });

    gsap.delayedCall(0.85, () => { isAnimatingRef.current = false; });
  };

  useEffect(() => {
    // Set panels off-screen on mount
    panelRefs.forEach((ref) => {
      if (ref.current) gsap.set(ref.current, { x: "100%" });
    });

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
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSection(currentIndexRef.current + 1);
        else goToSection(currentIndexRef.current - 1);
      }
    };

    // Mobile scroll — drives overlay opacity frame-by-frame
    const handleMobileScroll = () => {
      if (!isMobileRef.current || !scrollContainerRef.current) return;
      const scrollY = scrollContainerRef.current.scrollTop;
      const h = window.innerHeight;
      const rawProgress = scrollY / h;
      const newIndex = Math.round(rawProgress);

      if (newIndex !== currentIndexRef.current && newIndex >= 0 && newIndex < SECTION_COUNT) {
        setActiveIndex(newIndex);
        currentIndexRef.current = newIndex;
      }

      const progress = Math.min(1, Math.max(0, rawProgress));
      if (burgundyOverlayRef.current) burgundyOverlayRef.current.style.opacity = String(progress);
      if (darkOverlayRef.current) darkOverlayRef.current.style.opacity = String(1 - progress);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);

      if (!mobile) {
        // Restore desktop panel positions after resize
        panelRefs.forEach((ref, i) => {
          if (ref.current)
            gsap.set(ref.current, { x: i + 1 <= currentIndexRef.current ? "0%" : "100%" });
        });
        // Clear mobile inline opacity overrides
        if (burgundyOverlayRef.current) burgundyOverlayRef.current.style.opacity = "";
        if (darkOverlayRef.current) darkOverlayRef.current.style.opacity = "";
      }
    };

    handleResize();

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleMobileScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      container?.removeEventListener("scroll", handleMobileScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hamburger menu animation
  useEffect(() => {
    const overlay = menuOverlayRef.current;
    const items = menuItemRefs.current.filter(Boolean);
    if (!overlay) return;

    if (isMenuOpen) {
      gsap.killTweensOf([overlay, items]);
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: "power3.out", delay: 0.12 });
    } else {
      gsap.killTweensOf([overlay, items]);
      gsap.to(overlay, {
        opacity: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [isMenuOpen]);

  const navItems = ["Home", "About", "Contact"];

  return (
    <div
      ref={scrollContainerRef}
      className={`relative h-[100dvh] w-screen text-white ${
        isMobile ? "overflow-y-auto overflow-x-hidden snap-y snap-mandatory" : "overflow-hidden"
      }`}
    >

      {/* ── Fixed background image (always behind everything) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-110 contrast-105 saturate-110"
          priority
          quality={100}
          unoptimized
        />
        {/* Subtle veil on home */}
        <div
          ref={darkOverlayRef}
          className={`absolute inset-0 bg-black/10 transition-opacity duration-700 ${
            activeIndex === 0 ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Mobile-only: burgundy overlay driven by scroll progress */}
        <div
          ref={burgundyOverlayRef}
          className={`absolute inset-0 bg-[#800020] transition-opacity duration-700 md:hidden ${
            activeIndex > 0 ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* ── Desktop fixed panels (slide in from right over home) ── */}

      {/* About panel — z-20 */}
      <div
        ref={panel1Ref}
        className="fixed inset-0 z-20 bg-[#800020] hidden md:flex flex-col items-center justify-center px-20 text-center"
      >
        <div className="max-w-[860px] mx-auto">
          <p className="text-3xl lg:text-[38px] font-light leading-snug mb-10 text-white">
            Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.
          </p>
          <p className="text-sm font-normal tracking-[0.25em] text-white/65 uppercase">
            Accredited investors only.
          </p>
        </div>
      </div>

      {/* Contact panel — z-30 (on top of About) */}
      <div
        ref={panel2Ref}
        className="fixed inset-0 z-30 bg-[#800020] hidden md:flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex flex-col items-center gap-6">
          <svg
            width="34" height="34" viewBox="0 0 100 100"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"
            className="opacity-65 mb-2"
          >
            <polygon points="50,5 61,39 98,39 67,59 79,91 50,70 21,91 33,59 2,39 39,39" />
          </svg>
          <a
            href="mailto:info@nstarassoc.com"
            className="flex items-center justify-center gap-3 text-[24px] font-bold tracking-[0.08em] text-white/90 transition-colors hover:text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            info@nstarassoc.com
          </a>
          <p className="text-[18px] tracking-[0.2em] text-white/60 uppercase mt-2">
            Track record available upon request for accredited investors
          </p>
        </div>
        <div className="absolute bottom-10 w-full text-center text-xs tracking-wider text-white/45 px-4">
          2026 Northstar Associates LLC All rights reserved.
        </div>
      </div>

      {/* ── Navigation (above all panels) ── */}
      <nav
        className="fixed top-10 left-0 w-full z-[60] flex items-center justify-between pointer-events-none"
        style={{ paddingLeft: "max(3rem, 10vw)", paddingRight: "max(3rem, 10vw)" }}
      >
        <div className="text-xl md:text-2xl font-light tracking-[0.2em] text-white pointer-events-auto">
          Northstar
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-white pointer-events-auto p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-[7px] w-6">
            <span className="block h-px bg-white origin-center" style={{ transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transform: isMenuOpen ? "translateY(8px) rotate(45deg)" : "none" }} />
            <span className="block h-px bg-white origin-center" style={{ transition: "opacity 0.35s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)", opacity: isMenuOpen ? 0 : 1, transform: isMenuOpen ? "scaleX(0)" : "scaleX(1)" }} />
            <span className="block h-px bg-white origin-center" style={{ transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transform: isMenuOpen ? "translateY(-8px) rotate(-45deg)" : "none" }} />
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10 pointer-events-auto">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => goToSection(index)}
              className={`text-[12px] tracking-[0.2em] uppercase transition-all duration-300 relative ${
                activeIndex === index ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {item}
              <span className={`absolute left-0 -bottom-1 h-px bg-white transition-all duration-300 ${activeIndex === index ? "w-full" : "w-0"}`} />
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 bg-[#800020] z-50 hidden flex-col items-center justify-center"
      >
        <div className="flex flex-col gap-12 items-center">
          {navItems.map((item, index) => (
            <button
              key={item}
              ref={(el) => { menuItemRefs.current[index] = el; }}
              onClick={() => goToSection(index)}
              className="text-2xl tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="relative z-10">

        {/* Home — always the base, never moves */}
        <section
          id="section-0"
          className={`w-full ${isMobile ? "min-h-[100dvh] snap-start" : "h-[100dvh]"} flex flex-col items-center justify-center relative px-4`}
        >
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-light tracking-wide mb-6 text-white">
              Northstar
            </h1>
            <div className="flex justify-center gap-3">
              <div className="w-16 md:w-20 h-px bg-white/60" />
              <div className="w-6 md:w-8 h-px bg-white/60" />
            </div>
          </div>
          <button
            onClick={() => goToSection(1)}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce opacity-80">
              <polyline points="4,7 10,13 16,7" />
            </svg>
          </button>
        </section>

        {/* About + Contact — mobile only (desktop uses fixed panels above) */}
        <section
          id="section-1"
          className="md:hidden w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center px-6 text-center py-24"
        >
          <div className="max-w-[860px] mx-auto">
            <p className="text-xl sm:text-[26px] font-light leading-snug mb-10 text-white">
              Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.
            </p>
            <p className="text-[11px] font-normal tracking-[0.25em] text-white/65 uppercase">
              Accredited investors only.
            </p>
          </div>
        </section>

        <section
          id="section-2"
          className="md:hidden w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center relative px-4 text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <svg width="34" height="34" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" className="opacity-65 mb-2">
              <polygon points="50,5 61,39 98,39 67,59 79,91 50,70 21,91 33,59 2,39 39,39" />
            </svg>
            <a
              href="mailto:info@nstarassoc.com"
              className="flex items-center justify-center gap-3 text-[24px] font-bold tracking-[0.08em] text-white/90 transition-colors hover:text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              info@nstarassoc.com
            </a>
            <p className="text-[18px] tracking-[0.2em] text-white/60 uppercase mt-2">
              Track record available upon request for accredited investors
            </p>
          </div>
          <div className="absolute bottom-8 w-full text-center text-[10px] tracking-wider text-white/45 px-4">
            2026 Northstar Associates LLC All rights reserved.
          </div>
        </section>

      </div>
    </div>
  );
}
