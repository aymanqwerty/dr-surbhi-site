import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";

// Real details sourced from Dr. Surbhi Patne's CV.
const doctor = {
  name: "Dr. Surbhi Patne",
  specialization: "Obstetrician & Gynaecologist",
  qualification: "MBBS, MS (Obstetrics & Gynaecology), DNB",
  experience_years: 6,
  languages: ["English", "Hindi"],
};

const bio =
  "Dr. Surbhi Patne is a dedicated Obstetrician & Gynaecologist providing comprehensive women's healthcare — from antenatal and high-risk pregnancy care to laparoscopic gynaecological surgery. With strong clinical judgement and a warm, listening-first approach, she is committed to continuous learning and to improving every patient's experience.";

const expertise = [
  "Antenatal & Postnatal Care",
  "High-Risk Pregnancy",
  "Laparoscopic Surgery",
  "PCOS & Endometriosis",
  "Infertility Workup",
  "Menopausal Health",
];

const education = [
  { degree: "MBBS", institution: "Gajra Raja Medical College, Gwalior (MP)", years: "2014 – 2019" },
  {
    degree: "MS — Obstetrics & Gynaecology",
    institution: "People's College of Medical Sciences & Research Centre, Bhopal (MP)",
    years: "2022 – 2025",
  },
  {
    degree: "DNB — Obstetrics & Gynaecology",
    institution: "National Board of Examinations",
    years: "2026",
  },
];

const experience = [
  {
    role: "Senior Resident (Obs & Gynae)",
    place: "Atal Bihari Vajpayee Govt. Medical College, Vidisha (MP)",
    years: "2025 – Present",
  },
  {
    role: "Medical Officer",
    place: "Jai Prakash District Hospital, Bhopal (MP)",
    years: "2021 – 2022",
  },
  {
    role: "General Physician",
    place: "Maa Janki Multispecialty Hospital, Bhopal (MP)",
    years: "2020 – 2021",
  },
  {
    role: "Junior Resident & Internship",
    place: "Gajra Raja Medical College, Gwalior (MP)",
    years: "2019 – 2020",
  },
];

const workshops = [
  "Advanced Laparoscopic Gynaecological Surgery Workshop",
  "Obstetric Ultrasound & Fetal Monitoring Course",
  "Basic Life Support (BLS) & Advanced Cardiovascular Life Support (ACLS)",
];

const phone = "+91 8225978199";
const email = "surpatne@gmail.com";

const services = [
  {
    title: "Pregnancy & Antenatal Care",
    desc: "Comprehensive antenatal and postnatal care, monitoring, and delivery guidance — normal, instrumental, and Caesarean.",
  },
  {
    title: "High-Risk Pregnancy",
    desc: "Management of GDM (gestational diabetes), PIH (pregnancy-induced hypertension), thyroid disorders, and emergency obstetric care.",
  },
  {
    title: "PCOS, Endometriosis & Hormones",
    desc: "Evaluation and personalised treatment for PCOS/PCOD, endometriosis, and menstrual & hormonal health concerns.",
  },
  {
    title: "Laparoscopic Surgery",
    desc: "Minimally invasive (keyhole) gynaecological surgery including LAVH/TLH, ovarian cystectomy, and myomectomy.",
  },
  {
    title: "Family Planning & Adolescent Care",
    desc: "Contraceptive counselling, IUCD insertion, tubal ligation, infertility workup, and adolescent & puberty health.",
  },
  {
    title: "Preventive & Menopausal Care",
    desc: "Cervical cancer screening (colposcopy, VIA/VILI), routine check-ups, and menopausal health & transition support.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection
        doctorName={doctor.name}
        specialization={doctor.specialization}
        qualification={doctor.qualification}
      />

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Specialised Care
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sage-900 sm:text-4xl">
            Obstetrics & Gynaecology Services
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sage-600 sm:text-base">
            Comprehensive women&apos;s healthcare across every life stage — from adolescence and
            pregnancy through to menopause.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-sage-200/70 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-sage-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sage-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-sage-200/60 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-12 md:grid-cols-12">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-cream-100 p-2 shadow-soft ring-1 ring-sage-200/70 md:col-span-5">
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                <Image
                  src="/dr_surbhi.png"
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="space-y-6 md:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Meet your Gynaecologist
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-sage-900 sm:text-4xl">{doctor.name}</h2>
              <div className="h-px w-24 bg-gradient-to-r from-gold-400 to-transparent" />
              <p className="text-sm leading-relaxed text-sage-700 sm:text-base">{bio}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1.5 text-[11px] font-medium text-brand-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-6 border-t border-sage-200/60 pt-6 text-sm">
                <Meta label="Credentials" value={doctor.qualification} />
                <Meta label="Languages Spoken" value={doctor.languages.join(", ")} />
                <Meta label="Experience" value={`${doctor.experience_years}+ Years in Medicine`} />
                <Meta label="Specialisation" value={doctor.specialization} highlight />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section id="credentials" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Training & Track Record
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sage-900 sm:text-4xl">
            Qualifications & Experience
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-sage-200/70 bg-white p-8 shadow-card">
            <h3 className="mb-6 text-lg font-bold text-sage-900">Education</h3>
            <ul className="space-y-5">
              {education.map((ed) => (
                <li key={ed.degree} className="relative border-l border-sage-200 pl-5">
                  <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-brand-50" />
                  <p className="text-sm font-bold text-sage-800">{ed.degree}</p>
                  <p className="text-xs text-sage-500">{ed.institution}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-brand-600">{ed.years}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-sage-200/60 pt-6">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sage-400">
                Workshops & Certifications
              </h4>
              <ul className="space-y-2">
                {workshops.map((w) => (
                  <li key={w} className="flex gap-2 text-xs text-sage-600">
                    <span className="mt-0.5 text-gold-500">✓</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-sage-200/70 bg-white p-8 shadow-card">
            <h3 className="mb-6 text-lg font-bold text-sage-900">Professional Experience</h3>
            <ul className="space-y-5">
              {experience.map((ex) => (
                <li key={ex.role} className="relative border-l border-sage-200 pl-5">
                  <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-brand-50" />
                  <p className="text-sm font-bold text-sage-800">{ex.role}</p>
                  <p className="text-xs text-sage-500">{ex.place}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-brand-600">{ex.years}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Booking CTA + contact */}
      <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl border border-sage-200/70 bg-white p-8 shadow-card">
            <div>
              <h3 className="text-xl font-bold text-sage-900">Get in touch</h3>
              <div className="mt-4 space-y-2 text-sm font-medium text-sage-800">
                <div>📞 {phone}</div>
                <div>✉️ {email}</div>
                <div>📍 Bhilai, Chhattisgarh</div>
              </div>
            </div>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"
            >
              View full contact details
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white shadow-soft">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)" }}
            />
            <span className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-brand-100">
              Booking
            </span>
            <h4 className="relative mt-2 text-lg font-bold">Book a Consultation</h4>
            <p className="relative mt-3 text-sm leading-relaxed text-brand-50/90">
              Choose a clinic, pick a date and time that suits you, and confirm your appointment
              online in under a minute. Sign in to book faster and manage your family&apos;s
              appointments in one place.
            </p>
            <Link
              href="/book"
              className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <Footer phone={phone} email={email} />
    </div>
  );
}

function Meta({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sage-400">{label}</dt>
      <dd className={`mt-1 text-sm font-bold ${highlight ? "text-brand-600" : "text-sage-800"}`}>
        {value}
      </dd>
    </div>
  );
}
