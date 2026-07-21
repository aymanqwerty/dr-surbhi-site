"use client";

import Link from "next/link";

import { usePatientSession } from "@/lib/hooks";

export function HeaderAuth() {
  const { data: session } = usePatientSession();

  return (
    <div className="flex items-center gap-4">
      <Link
        href={session ? "/account" : "/login"}
        className="hidden text-sm font-medium text-sage-600 transition-colors hover:text-brand-500 sm:inline"
      >
        {session ? "My Account" : "Sign In"}
      </Link>
      <Link
        href="/book"
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:scale-105 active:scale-95"
      >
        Book Appointment
      </Link>
    </div>
  );
}
