// components/Navigation.js
"use client";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      const scrollPosition = window.scrollY;
      const windowWidth = window.innerWidth;


      const sectionIndex = Math.round(scrollPosition / windowWidth);
      setActiveSection(Math.min(2, Math.max(0, sectionIndex)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index) => {
    const scrollAmount = window.innerWidth * index;
    window.scrollTo({
      top: scrollAmount,
      behavior: "smooth"
    });
  };

  const navItems = ["Home", "About", "Contact"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 px-6 md:px-12 py-2 flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-light tracking-wider text-white">
        Northstar
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8">
        {navItems.map((item, index) => (
          <button
            key={item}
            onClick={() => scrollToSection(index)}
            className={`text-sm uppercase tracking-wider transition-all duration-300 ${activeSection === index
              ? "text-white border-b border-white/50 pb-1"
              : "text-white/50 hover:text-white/80"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
    </nav>
  );
}