import type { Metadata } from "next";

import { VoicePanelClient } from "@/features/voice/VoicePanelClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Talk to the Receptionist | Dr. Surbhi Patne",
};

export default function AssistantPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-sage-900 sm:text-3xl">Talk to our AI Receptionist</h1>
          <p className="mt-1 text-sm text-sage-500">
            Ask about Dr. Surbhi&apos;s services or book an appointment — by voice or by typing.
          </p>
        </div>
        <VoicePanelClient />
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
