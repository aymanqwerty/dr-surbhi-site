import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Dr. Surbhi Patne | Obstetrician & Gynaecologist",
};

const opdSkills = [
  "Comprehensive antenatal & postnatal care",
  "Gynaecological outpatient consultations & examinations",
  "Family planning counselling & procedures (e.g. IUCD insertion)",
  "Basic infertility workup & counselling",
  "Ultrasound interpretation for obstetric & gynaecological conditions",
  "Management of common gynaecological infections & disorders",
  "Adolescent health & puberty-related disorder management",
  "Cervical cancer screening (Colposcopy and VIA/VILI)",
  "Management of PCOS, Endometriosis & menopausal health",
  "Management of GDM, PIH & thyroid disorders in pregnancy",
];

const otSkills = [
  "Normal, instrumental & Caesarean deliveries",
  "Minor gynaecological procedures (D&C, cervical biopsy)",
  "Major gynaecological surgery (hysterectomy, ovarian cystectomy, myomectomy)",
  "Diagnostic & Level II/III laparoscopic surgery (LAVH/TLH)",
  "Management of PPH, eclampsia & ruptured ectopic pregnancy",
  "Family planning: tubal ligation",
  "Post-operative care & management of surgical patients",
  "High-volume surgical care — independent LSCS & emergency obstetric interventions",
];

function SkillList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-card">
      <h3 className="mb-5 text-lg font-bold text-sage-900">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-sage-600">
            <span className="mt-0.5 text-brand-500">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50/20">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border-8 border-brand-50 shadow-soft md:col-span-4">
            <Image
              src="/dr_surbhi.png"
              alt="Dr. Surbhi Patne"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              priority
            />
          </div>
          <div className="md:col-span-8">
            <h1 className="text-3xl font-extrabold text-sage-900 sm:text-4xl">Dr. Surbhi Patne</h1>
            <p className="mt-1 text-sm font-semibold text-brand-600">
              MBBS, MS (Obstetrics & Gynaecology), DNB · Bhilai, Chhattisgarh
            </p>
            <div className="mt-4 h-1 w-20 rounded-full bg-brand-500" />
            <p className="mt-5 text-sm leading-relaxed text-sage-700 sm:text-base">
              Dr. Surbhi Patne is a dedicated Obstetrician & Gynaecologist with extensive experience
              in women&apos;s healthcare and post-operative management. From antenatal and high-risk
              pregnancy care to laparoscopic gynaecological surgery, she combines strong clinical
              judgement with a warm, listening-first approach — committed to continuous learning and
              to improving every patient&apos;s experience.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:scale-105"
            >
              Book an Appointment
            </Link>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-extrabold text-sage-900">Clinical Expertise</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SkillList title="Outpatient (OPD)" items={opdSkills} />
            <SkillList title="Surgical (OT)" items={otSkills} />
          </div>
        </section>
      </main>
      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
