import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "@/lib/providers";

// Modern geometric sans — loaded once, exposed as --font-sans (see globals.css).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr. Surbhi Patne | Obstetrician & Gynaecologist — Bhilai",
  description:
    "Book an appointment with Dr. Surbhi Patne (MBBS, MS, DNB) — expert obstetric and gynaecological care in Bhilai, Chhattisgarh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
