"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "user" | "users" | "calendar" | "document" | "gear";

const ICONS: Record<IconName, string> = {
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0",
  users:
    "M18 18.72a9.09 9.09 0 003.74-.48 3 3 0 00-4.68-2.72M18 18.72V18.6a5.97 5.97 0 00-.94-3.2M18 18.72c-1.76 1.01-3.8 1.58-5.98 1.58-2.17 0-4.2-.57-5.96-1.58M6.06 15.4A5.97 5.97 0 005.12 18.6v.12m.94-3.32a6 6 0 0111.88 0M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  document:
    "M19.5 14.25v-2.62a3.38 3.38 0 00-3.38-3.38h-1.5A1.13 1.13 0 0113.5 7.13v-1.5A3.38 3.38 0 0010.13 2.25H8.25m2.25 0H5.63c-.62 0-1.13.5-1.13 1.13v17.25c0 .62.5 1.12 1.13 1.12h12.75c.62 0 1.12-.5 1.12-1.12V11.25a9 9 0 00-9-9z",
  gear: "M9.6 3.6l.7-1.4a1.1 1.1 0 011-.6h1.4a1.1 1.1 0 011 .6l.7 1.4 1.5.9 1.6-.2a1.1 1.1 0 011 .5l.7 1.2a1.1 1.1 0 01-.1 1.2l-1 1.2v1.8l1 1.2a1.1 1.1 0 01.1 1.2l-.7 1.2a1.1 1.1 0 01-1 .5l-1.6-.2-1.5.9-.7 1.4a1.1 1.1 0 01-1 .6h-1.4a1.1 1.1 0 01-1-.6l-.7-1.4-1.5-.9-1.6.2a1.1 1.1 0 01-1-.5l-.7-1.2a1.1 1.1 0 01.1-1.2l1-1.2v-1.8l-1-1.2a1.1 1.1 0 01-.1-1.2l.7-1.2a1.1 1.1 0 011-.5l1.6.2 1.5-.9zM12 15a3 3 0 100-6 3 3 0 000 6z",
};

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/account/profile", label: "Profile", icon: "user" },
  { href: "/account/family", label: "Family Members", icon: "users" },
  { href: "/account/appointments", label: "My Appointments", icon: "calendar" },
  { href: "/account/lab-reports", label: "Lab Reports", icon: "document" },
  { href: "/account/settings", label: "Settings", icon: "gear" },
];

export function AccountSidebar({ name, phone }: { name: string; phone: string }) {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-brand-100 bg-white p-4 shadow-card lg:sticky lg:top-24">
      <div className="mb-4 flex items-center gap-3 px-2 py-2">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-500 text-base font-bold text-white">
          {name ? name.charAt(0).toUpperCase() : "•"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sage-900">{name || "Your account"}</p>
          <p className="truncate text-xs text-sage-400">{phone}</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-sage-600 hover:bg-sage-50 hover:text-sage-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="h-5 w-5 shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[item.icon]} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
