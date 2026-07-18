"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mfg-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage, an external system, on mount
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-ink-600 leading-relaxed">
          We use only essential cookies by default. Optional content, like the Calendly booking
          calendar, is loaded only after you give consent. Read our{" "}
          <Link href="/datenschutz" className="underline text-ink-900 hover:text-accent-600">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-400"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="accent-gradient rounded-full px-4 py-2 text-sm font-medium text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
