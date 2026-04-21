"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const horizontalRef = useRef(null);

  useEffect(() => {
    const sections = sectionsRef.current;
    if (!sections.length) return;

    const horizontalTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () =>
          `+=${containerRef.current?.offsetWidth ? containerRef.current.offsetWidth * (sections.length - 1) : 0}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      horizontalTween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="overflow-hidden">
      <div ref={containerRef} className="relative h-screen w-screen overflow-hidden">
        <div ref={horizontalRef} className="relative flex h-full w-max">
          <div ref={addToRefs} className="relative h-screen w-screen flex-shrink-0">
            <HomeSection />
          </div>
          <div ref={addToRefs} className="relative h-screen w-screen flex-shrink-0">
            <AboutSection />
          </div>
          <div ref={addToRefs} className="relative h-screen w-screen flex-shrink-0">
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
}
