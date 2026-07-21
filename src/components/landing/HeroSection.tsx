import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  doctorName: string;
  specialization: string;
  qualification: string;
}

export function HeroSection({ doctorName, specialization, qualification }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-brand-50/50 to-white px-6 py-16 sm:py-24">
      {/* Decorative background blobs */}
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sage-100/30 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

          {/* Column 1: Info and Welcome */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              {specialization}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-sage-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              Compassionate Care <br />
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                For Every Stage
              </span>{" "}
              of Womanhood
            </h1>

            <p className="text-base text-sage-600 sm:text-lg max-w-xl leading-relaxed">
              Warm, listening-first women&apos;s healthcare with <strong>{doctorName}</strong>.
              Book routine wellness checks, prenatal monitoring, or a consult on hormonal health — instantly.
            </p>

            {/* Quick Benefits/Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border-l-2 border-brand-300 pl-3">
                <span className="block text-lg font-bold text-sage-800">MS &amp; DNB</span>
                <span className="text-xs text-sage-400">Qualified Specialist</span>
              </div>
              <div className="border-l-2 border-brand-300 pl-3">
                <span className="block text-lg font-bold text-sage-800">Laparoscopy</span>
                <span className="text-xs text-sage-400">Minimally Invasive</span>
              </div>
              <div className="border-l-2 border-brand-300 pl-3">
                <span className="block text-lg font-bold text-sage-800">100%</span>
                <span className="text-xs text-sage-400">Confidential Care</span>
              </div>
            </div>

            {/* Interactive Navigation Link Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-md hover:scale-105 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                Book Appointment
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-7 py-3.5 text-sm font-semibold text-sage-700 shadow-card transition-all hover:bg-sage-50 hover:text-sage-900"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Column 2: Voice Receptionist Interactive Mockup */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm rounded-3xl border border-brand-200/80 bg-white p-6 shadow-soft transition-transform hover:scale-[1.02] duration-300">

              {/* Pulse Indicator */}
              <div className="flex items-center justify-between border-b border-brand-50 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                  Receptionist Online
                </span>
                <span className="rounded-full bg-sage-50 px-2.5 py-1 text-[10px] font-medium text-sage-500 uppercase">
                  Voice Agent
                </span>
              </div>

              {/* Receptionist Avatar Visualization */}
              <div className="my-6 flex flex-col items-center text-center">
                <div className="relative h-24 w-24">
                  <span className="absolute -inset-1.5 animate-pulse rounded-full border-2 border-brand-200" />
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-brand-100 bg-brand-50">
                    <Image
                      src="/dr_surbhi_avatar.png"
                      alt={`${doctorName} virtual assistant`}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-sm font-bold text-sage-800">{doctorName}&apos;s Voice AI</h3>
                <p className="text-[11px] text-sage-400">{qualification}</p>
              </div>

              {/* Simulated Chat Bubbles */}
              <div className="space-y-3 bg-sage-50/50 rounded-2xl p-4 text-[11px] leading-relaxed border border-brand-50">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sage-400 mb-0.5">Voice Agent:</span>
                  <p className="rounded-2xl rounded-tl-none bg-white p-2.5 text-sage-700 shadow-card border border-brand-50">
                    &ldquo;Hello! I can help you schedule an appointment with Dr. Surbhi. What day works for you?&rdquo;
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-brand-400 mb-0.5">Patient:</span>
                  <p className="rounded-2xl rounded-tr-none bg-brand-500 p-2.5 text-white shadow-soft">
                    &ldquo;I&apos;d like to book an appointment for Monday morning.&rdquo;
                  </p>
                </div>
              </div>

              {/* Soundwaves mockup */}
              <div className="mt-4 flex items-center justify-center gap-1 h-6">
                {[12, 18, 14, 20, 24, 16, 22, 14, 10, 8].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 rounded-full bg-brand-400 animate-pulse"
                  />
                ))}
              </div>

              {/* Voice entry point — opens the dedicated AI receptionist page. */}
              <Link
                href="/assistant"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-900 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-sage-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
                Talk to Receptionist
              </Link>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] text-sage-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Book by voice or text in a quick chat
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
