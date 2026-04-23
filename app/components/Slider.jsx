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
      <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
        <Image
          src={backgroundImage}
          alt="Northstar background"
          fill
          className="object-cover object-bottom brightness-110 contrast-105 saturate-110"
          priority
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
          className={`absolute inset-0 bg-[#A8415B] transition-opacity duration-700 md:hidden ${
            activeIndex > 0 ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* ── Desktop fixed panels (slide in from right over home) ── */}

      {/* About panel — z-20 */}
      <div
        ref={panel1Ref}
        className="fixed inset-0 z-20 bg-[#A8415B] hidden md:flex flex-col items-center justify-center px-20 text-center"
      >
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[30px] font-light leading-[1.75] mb-2 text-white">
            Northstar is an alternative equity and fixed income strategies<br />manager specializing in diverse arbitrage transactions in the <span className="whitespace-nowrap">U.S. markets.</span>
          </p>
          <p className="text-[20px] font-light leading-[1.75] text-white mt-6">
            * Accredited investors only.
          </p>
        </div>
      </div>

      {/* Contact panel — z-30 (on top of About) */}
      <div
        ref={panel2Ref}
        className="fixed inset-0 z-30 bg-[#A8415B] hidden md:flex flex-col items-center justify-center px-12 text-center"
      >
        <div className="flex flex-col items-center gap-5 md:gap-6 max-w-[900px]">
          <svg
            width="35" height="35" viewBox="0 0 100 100"
            fill="none" stroke="white" strokeLinejoin="round" strokeLinecap="round"
            className="mb-2"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(255,255,255,0.4))" }}
          >
            <path d="M50,5 L76.4,86.4 L7.2,36.1 L92.8,36.1 L23.6,86.4 Z" strokeWidth="2.5" stroke="rgba(255,255,255,0.3)" />
            <path d="M50,5 L76.4,86.4 L7.2,36.1 L92.8,36.1 L23.6,86.4 Z" strokeWidth="2" />
          </svg>
          <a
            href="mailto:info@nstarassoc.com"
            className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-[0.04em] md:tracking-[0.08em] text-white/75 underline underline-offset-4 decoration-white/40 transition-all duration-300 hover:text-white hover:decoration-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.75)"
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
          <p className="text-[20px] sm:text-[22px] md:text-[24px] font-[500] tracking-[0.04em] md:tracking-[0.08em] leading-relaxed text-white/75 mt-2 underline underline-offset-4 decoration-white/40 transition-all duration-300 cursor-pointer hover:text-white hover:decoration-white">
            Track record available upon request for accredited investors.
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
        <div className="text-white font-semibold tracking-[0.12em] flex items-baseline pointer-events-auto" style={{ fontFamily: "var(--font-brix, 'DM Sans', sans-serif)" }}>
          <span style={{ fontSize: "35px" }}>N</span>
          <span style={{ fontSize: "35px" }}>orthstar</span>
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
              className={`group text-[14px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative ${
                activeIndex === index ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 bg-[#A8415B] z-50 hidden flex-col items-center justify-center"
      >
        <div className="flex flex-col gap-12 items-center">
          {navItems.map((item, index) => (
            <button
              key={item}
              ref={(el) => { menuItemRefs.current[index] = el; }}
              onClick={() => goToSection(index)}
              className={`relative group text-2xl font-bold tracking-[0.2em] uppercase transition-colors ${
                activeIndex === index ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {item}
              <span className="absolute left-0 -bottom-2 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
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
          className="md:hidden w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center px-14 text-center py-24"
        >
          <div className="max-w-[860px] mx-auto">
            <p className="text-[24px] sm:text-[26px] md:text-[30px] font-light leading-[1.65] mb-2 text-white">
              Northstar is an alternative equity and fixed income strategies manager specializing in diverse<br />arbitrage transactions in the <span className="whitespace-nowrap">U.S. markets.</span>
            </p>
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-light leading-[1.65] text-white mt-6">
              * Accredited investors only.
            </p>
          </div>
        </section>

        <section
          id="section-2"
          className="md:hidden w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center relative px-14 text-center"
        >
          <div className="flex w-full max-w-[860px] flex-col items-center gap-5">
            <svg width="35" height="35" viewBox="0 0 100 100" fill="none" stroke="white" strokeLinejoin="round" strokeLinecap="round" className="mb-2" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(255,255,255,0.4))" }}>
              <path d="M50,5 L76.4,86.4 L7.2,36.1 L92.8,36.1 L23.6,86.4 Z" strokeWidth="2.5" stroke="rgba(255,255,255,0.3)" />
              <path d="M50,5 L76.4,86.4 L7.2,36.1 L92.8,36.1 L23.6,86.4 Z" strokeWidth="2" />
            </svg>
            <a
              href="mailto:info@nstarassoc.com"
              className="flex max-w-full flex-wrap items-center justify-center gap-2 text-[20px] sm:text-[22px] font-bold tracking-[0.04em] text-white/75 underline underline-offset-4 decoration-white/40 transition-all duration-300 hover:text-white hover:decoration-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
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
            <p className="mx-auto max-w-[260px] sm:max-w-[340px] text-[20px] sm:text-[22px] font-[500] tracking-[0.04em] leading-relaxed text-white/75 mt-2 underline underline-offset-4 decoration-white/40 transition-all duration-300 cursor-pointer hover:text-white hover:decoration-white">
              Track record available upon request for accredited investors.
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
