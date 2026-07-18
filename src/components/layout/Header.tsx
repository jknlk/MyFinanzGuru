"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { gsap } from "gsap";
import { NAV_LINKS } from "@/lib/nav";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local UI state on route change
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen && menuRef.current) {
      const links = menuRef.current.querySelectorAll("[data-menu-link]");
      gsap.fromTo(
        links,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06, delay: 0.1 }
      );
    }
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-sky-50/85 backdrop-blur-md border-b border-ink-200/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[100rem] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="font-serif text-xl font-semibold text-ink-900">
          MyFinanz<span className="text-accent-500">Guru</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative pb-1 text-sm font-medium text-ink-700 transition-colors hover:text-accent-600",
                pathname === link.href &&
                  "text-accent-600 after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:rounded-full after:bg-accent-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin"
            aria-label="Admin"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-ink-500 hover:text-accent-600"
          >
            <User className="h-4 w-4" />
          </Link>
          <Button href="/book" variant="outline" size="md">
            Book a Meeting →
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2 text-ink-900"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-50 flex flex-col bg-sky-50 lg:hidden"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-serif text-xl font-semibold text-ink-900">
              MyFinanz<span className="text-accent-500">Guru</span>
            </span>
            <button
              type="button"
              className="p-2 text-ink-900"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-menu-link
                className="font-serif text-3xl text-ink-900 hover:text-accent-600"
              >
                {link.label}
              </Link>
            ))}
            <div data-menu-link className="pt-6">
              <Button href="/book" size="lg">
                Book a Meeting →
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
