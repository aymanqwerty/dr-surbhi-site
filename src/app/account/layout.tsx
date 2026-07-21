"use client";

import Link from "next/link";

import { AccountSidebar } from "@/features/account/AccountSidebar";
import { usePatientSession } from "@/lib/hooks";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = usePatientSession();

  return (
    <div className="min-h-screen bg-cream-50/20">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-sage-900">My Account</h1>
          <p className="mt-1 text-sm text-sage-500">
            Manage your details, family and appointments with Dr. Surbhi.
          </p>
        </div>

        {isPending ? (
          <p className="flex items-center gap-2 text-sm text-sage-500">
            <Spinner /> Loading...
          </p>
        ) : !session ? (
          <div className="mx-auto max-w-sm rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-card">
            <h2 className="text-lg font-bold text-sage-900">You&apos;re not signed in</h2>
            <p className="mt-1 text-sm text-sage-500">
              Sign in to view your dashboard.
            </p>
            <Link href="/login" className="mt-4 inline-block">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
            <AccountSidebar
              name={session.profile?.full_name ?? ""}
              phone={session.account.phone_number}
            />
            <div className="min-w-0">{children}</div>
          </div>
        )}
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
