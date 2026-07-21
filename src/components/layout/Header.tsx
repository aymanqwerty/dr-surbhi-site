import Link from "next/link";

import { HeaderAuth } from "@/components/layout/HeaderAuth";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-100/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-500 text-white shadow-soft transition-transform group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-sage-900">
              Dr. Surbhi Patne
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-brand-600">
              Obstetrician &amp; Gynaecologist
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-sage-600 lg:flex">
          <Link href="/" className="transition-colors hover:text-brand-500">
            Home
          </Link>
          <Link href="/#services" className="transition-colors hover:text-brand-500">
            Services
          </Link>
          <Link href="/about" className="transition-colors hover:text-brand-500">
            About
          </Link>
          <Link href="/clinics" className="transition-colors hover:text-brand-500">
            Clinics
          </Link>
          <Link href="/contact" className="transition-colors hover:text-brand-500">
            Contact
          </Link>
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Talk to AI
          </Link>
        </nav>

        <HeaderAuth />
      </div>
    </header>
  );
}
