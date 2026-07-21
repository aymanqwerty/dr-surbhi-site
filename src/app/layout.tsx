import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Dr. Surbhi Patne | Obstetrician & Gynaecologist — Bhilai",
  description:
    "Book an appointment with Dr. Surbhi Patne (MBBS, MS, DNB) — expert obstetric and gynaecological care in Bhilai, Chhattisgarh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
