import Link from "next/link";

interface FooterProps {
  clinicName?: string;
  phone?: string | null;
  email?: string | null;
}

export function Footer({ clinicName = "Dr. Surbhi Patne — Women's Health Clinic", phone, email }: FooterProps) {
  return (
    <footer className="border-t border-sage-200/70 bg-cream-100/60 py-14 text-sage-600">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Clinic Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-soft ring-1 ring-white/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-sage-900">
                {clinicName}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Compassionate, expert obstetric and gynaecological care for women of all ages,
              led by Dr. Surbhi Patne (MBBS, MS, DNB).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-sage-900">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-brand-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="transition-colors hover:text-brand-600">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/#about" className="transition-colors hover:text-brand-600">
                  Meet the Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-sage-900">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
              {phone && (
                <li>
                  <span className="font-semibold text-sage-800">Phone:</span> {phone}
                </li>
              )}
              {email && (
                <li>
                  <span className="font-semibold text-sage-800">Email:</span> {email}
                </li>
              )}
              <li>
                <span className="font-semibold text-sage-800">Location:</span> Bhilai, Chhattisgarh
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-12">
          <div className="hairline-gold" />
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-xs leading-relaxed text-red-800">
            <span className="mr-2 font-bold uppercase tracking-wider text-red-900">Emergency Disclaimer:</span>
            If you are experiencing severe abdominal pain, heavy bleeding, or any pregnancy-related medical emergency, please do not wait for an appointment — go to the nearest Emergency Room or hospital immediately.
          </div>
          <p className="mt-6 text-center text-xs text-sage-400">
            © {new Date().getFullYear()} {clinicName}. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-sage-400">
            Developed and managed by Ayman Akram
          </p>
        </div>
      </div>
    </footer>
  );
}
