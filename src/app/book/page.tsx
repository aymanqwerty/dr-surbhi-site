import { Suspense } from "react";

import { BookingEntry } from "@/features/booking/BookingEntry";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BookPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-sage-900 sm:text-3xl">Book an Appointment</h1>
          <p className="mt-1 text-sm text-sage-500">
            with Dr. Surbhi Patne · Obstetrician &amp; Gynaecologist
          </p>
        </div>
        <Suspense>
          <BookingEntry />
        </Suspense>
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
