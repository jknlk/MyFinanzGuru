import Link from "next/link";
import { AtSign, Mail, Share2 } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900">
      <div className="mx-auto max-w-[100rem] px-6 py-14 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-serif text-xl font-semibold text-white">
              MyFinanz<span className="text-accent-400">Guru</span>
            </span>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              {"{{CLIENT_ADDRESS}}"}
              <br />
              {"{{CLIENT_CITY}}"}, Germany
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-3">Navigate</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="text-sm text-white/60 hover:text-accent-400">
                  Book a Meeting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-3">Legal</p>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-sm text-white/60 hover:text-accent-400">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-white/60 hover:text-accent-400">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-3">Connect</p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-accent-400 hover:text-accent-400"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-accent-400 hover:text-accent-400"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@myfinanzguru.de"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-accent-400 hover:text-accent-400"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 MyFinanzGuru. All rights reserved. Financial guidance provided pursuant to
          §34f/§34h GewO where applicable — see Impressum for registration details.
        </div>
      </div>
    </footer>
  );
}
