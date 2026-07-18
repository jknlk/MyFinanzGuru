"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates every element with data-reveal inside the given container ref.
 * Groups siblings sharing a `data-reveal-group` attribute into one staggered
 * timeline; ungrouped elements animate individually.
 */
export function useGsapReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const groups = new Map<string, Element[]>();
      const singles: Element[] = [];

      container.querySelectorAll("[data-reveal]").forEach((el) => {
        const group = el.getAttribute("data-reveal-group");
        if (group) {
          if (!groups.has(group)) groups.set(group, []);
          groups.get(group)!.push(el);
        } else {
          singles.push(el);
        }
      });

      if (prefersReducedMotion) {
        gsap.set([...singles, ...Array.from(groups.values()).flat()], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      singles.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            },
          }
        );
      });

      groups.forEach((els) => {
        gsap.fromTo(
          els,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: els[0],
              start: "top 80%",
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}
