import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact | Dr. Surbhi Patne",
};

const contacts = [
  { label: "Phone", value: "+91 8225978199", href: "tel:+918225978199" },
  { label: "Alternate", value: "+91 8319091637", href: "tel:+918319091637" },
  { label: "Email", value: "surpatne@gmail.com", href: "mailto:surpatne@gmail.com" },
  { label: "Location", value: "Bhilai, Chhattisgarh", href: null },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-50/20">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-extrabold text-sage-900 sm:text-4xl">Get in touch</h1>
        <p className="mt-2 text-sm text-sage-500">
          For appointments, please book online. For queries, reach the clinic using the details
          below.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-card">
            <h2 className="mb-5 text-lg font-bold text-sage-900">Contact details</h2>
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={c.label}>
                  <p className="text-[11px] uppercase tracking-wider text-sage-400">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm font-semibold text-sage-800 hover:text-brand-600">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-sage-800">{c.value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-brand-100/40 p-8 shadow-card">
            <div>
              <h2 className="text-lg font-bold text-sage-900">Book an appointment</h2>
              <p className="mt-3 text-sm leading-relaxed text-sage-600">
                See live availability and confirm your visit online. Sign in to manage appointments
                for yourself and your family.
              </p>
            </div>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:scale-105"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50/55 p-4 text-xs leading-relaxed text-red-800">
          <span className="mr-2 font-bold uppercase tracking-wider text-red-900">
            Emergency:
          </span>
          If you are experiencing severe abdominal pain, heavy bleeding, or any pregnancy-related
          medical emergency, do not wait for an appointment — go to the nearest Emergency Room or
          hospital immediately.
        </div>
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
