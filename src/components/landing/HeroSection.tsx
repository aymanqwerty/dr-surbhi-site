import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  doctorName: string;
  specialization: string;
  qualification: string;
}

export function HeroSection({ doctorName, specialization, qualification }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-6 sm:pb-24 sm:pt-10">
      {/* Soft layered light — minimal, not blobby. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -10%, rgba(197,106,139,0.14), transparent 60%), radial-gradient(50rem 40rem at 100% 10%, rgba(246,241,234,0.9), transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-cream-50" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Column 1: Info and Welcome */}
          <div className="space-y-6 text-left lg:col-span-7 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
              {specialization}
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-sage-900 sm:text-5xl lg:text-6xl">
              Compassionate Care <br />
              <span className="text-gradient">For Every Stage</span> of Womanhood
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-sage-600 sm:text-lg">
              Warm, listening-first women&apos;s healthcare with <strong className="font-semibold text-sage-800">{doctorName}</strong>.
              Book routine wellness checks, prenatal monitoring, or a consult on hormonal health — instantly.
            </p>

            {/* Quick Benefits/Trust Badges */}
            <div className="grid grid-cols-3 gap-5 pt-2">
              {[
                { value: "MS & DNB", label: "Qualified Specialist" },
                { value: "Laparoscopy", label: "Minimally Invasive" },
                { value: "100%", label: "Confidential Care" },
              ].map((stat) => (
                <div key={stat.label} className="border-l border-gold-400/60 pl-3.5">
                  <span className="block text-lg font-bold text-sage-800">{stat.value}</span>
                  <span className="text-xs text-sage-400">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Interactive Navigation Link Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lift active:translate-y-0"
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
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white/70 px-7 py-3.5 text-sm font-semibold text-sage-700 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-300 hover:text-sage-900"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Column 2: Voice Receptionist Interactive Mockup — frosted glass */}
          <div className="lg:col-span-5 animate-fade-up [animation-delay:120ms]">
            <div className="glass relative mx-auto max-w-sm rounded-3xl p-6 transition-transform duration-300 hover:scale-[1.02]">
              {/* Pulse Indicator */}
              <div className="flex items-center justify-between border-b border-sage-200/60 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                  <span className="h-2 w-2 animate-ping rounded-full bg-brand-500" />
                  Receptionist Online
                </span>
                <span className="rounded-full bg-sage-100/80 px-2.5 py-1 text-[10px] font-medium uppercase text-sage-500">
                  Voice Agent
                </span>
              </div>

              {/* Receptionist Avatar Visualization */}
              <div className="my-6 flex flex-col items-center text-center">
                <div className="relative h-24 w-24">
                  <span className="absolute -inset-1.5 animate-pulse rounded-full border-2 border-brand-200" />
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-brand-50 shadow-soft">
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
              <div className="space-y-3 rounded-2xl border border-white/50 bg-white/40 p-4 text-[11px] leading-relaxed">
                <div className="flex flex-col items-start">
                  <span className="mb-0.5 font-semibold text-sage-400">Voice Agent:</span>
                  <p className="rounded-2xl rounded-tl-none border border-sage-200/60 bg-white p-2.5 text-sage-700 shadow-card">
                    &ldquo;Hello! I can help you schedule an appointment with Dr. Surbhi. What day works for you?&rdquo;
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="mb-0.5 font-semibold text-brand-400">Patient:</span>
                  <p className="rounded-2xl rounded-tr-none bg-brand-500 p-2.5 text-white shadow-soft">
                    &ldquo;I&apos;d like to book an appointment for Monday morning.&rdquo;
                  </p>
                </div>
              </div>

              {/* Soundwaves mockup */}
              <div className="mt-4 flex h-6 items-center justify-center gap-1">
                {[12, 18, 14, 20, 24, 16, 22, 14, 10, 8].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px`, animationDelay: `${i * 90}ms` }}
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
