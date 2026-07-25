import { Suspense } from "react";

import { AuthFlow } from "@/features/auth/AuthFlow";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-sage-900 sm:text-3xl">Patient Sign In</h1>
          <p className="mt-1 text-sm text-sage-500">
            Sign in to book faster and manage your appointments with Dr. Surbhi.
          </p>
        </div>
        <Suspense>
          <AuthFlow />
        </Suspense>
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
