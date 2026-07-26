import Link from "next/link";

import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="glass-header sticky top-0 z-40 w-full border-b border-sage-200/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left: mobile menu button + logo */}
        <div className="flex items-center gap-2 lg:gap-3">
          <MobileNav />
          <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-soft ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105">
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
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
              Obstetrician &amp; Gynaecologist
            </span>
          </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-sage-600 lg:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/#services", label: "Services" },
            { href: "/about", label: "About" },
            { href: "/clinics", label: "Clinics" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative transition-colors hover:text-brand-600 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand-500 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
            Talk to AI
          </Link>
        </nav>

        <HeaderAuth />
      </div>
    </header>
  );
}
