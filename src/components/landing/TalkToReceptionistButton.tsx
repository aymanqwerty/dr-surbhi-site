"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function TalkToReceptionistButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/assistant" className="inline-block">
      <Button variant="primary" className={`px-8 py-4.5 text-base font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95 ${className}`}>
        Talk to Dr. Surbhi&apos;s Virtual Receptionist
      </Button>
    </Link>
  );
}
