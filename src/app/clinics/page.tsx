import type { Metadata } from "next";

import { ClinicsList } from "@/features/clinics/ClinicsList";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Clinics | Dr. Surbhi Patne",
};

export default function ClinicsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage-900 sm:text-4xl">Clinics</h1>
        <p className="mt-2 text-sm text-sage-500">
          Where you can consult with Dr. Surbhi Patne. Book online to see live availability.
        </p>
        <div className="mt-8">
          <ClinicsList />
        </div>
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
