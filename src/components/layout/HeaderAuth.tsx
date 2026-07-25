"use client";

import Link from "next/link";

import { usePatientSession } from "@/lib/hooks";

export function HeaderAuth() {
  const { data: session } = usePatientSession();

  return (
    <div className="flex items-center gap-4">
      <Link
        href={session ? "/account" : "/login"}
        className="hidden text-sm font-medium text-sage-600 transition-colors hover:text-brand-600 sm:inline"
      >
        {session ? "My Account" : "Sign In"}
      </Link>
      <Link
        href="/book"
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lift active:translate-y-0"
      >
        Book Appointment
      </Link>
    </div>
  );
}
