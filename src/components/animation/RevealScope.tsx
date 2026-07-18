"use client";

import { useRef } from "react";
import { useGsapReveal } from "./useGsapReveal";

/**
 * Wrap page/section content in this to activate `data-reveal` /
 * `data-reveal-group` animations on any descendant, including server-rendered
 * children passed through from parent server components.
 */
export default function RevealScope({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
