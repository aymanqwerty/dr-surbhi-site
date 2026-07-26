"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { usePatientSession } from "@/lib/hooks";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/clinics", label: "Clinics" },
  { href: "/contact", label: "Contact" },
  { href: "/assistant", label: "Talk to AI" },
];

/**
 * Mobile menu (below `lg`): a hamburger on the left that opens a drawer sliding
 * in from the left edge. The drawer + backdrop are portalled to <body> because
 * the header uses `backdrop-filter`, which would otherwise trap `position:fixed`
 * children inside it instead of covering the viewport.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = usePatientSession();

  useEffect(() => setMounted(true), []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[60] bg-sage-900/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Left drawer */}
      <aside
        inert={!open}
        className={`fixed left-0 top-0 z-[70] flex h-full w-72 max-w-[82%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sage-200/60 px-5 py-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sage-600 transition-colors hover:bg-sage-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50 hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={session ? "/account" : "/login"}
            onClick={close}
            className="mt-1 border-t border-sage-100 px-3 py-3 text-sm font-semibold text-brand-600"
          >
            {session ? "My Account" : "Sign In"}
          </Link>
        </nav>
      </aside>
    </>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-sage-700 transition-colors hover:bg-sage-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {mounted && createPortal(drawer, document.body)}
    </div>
  );
}
