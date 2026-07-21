"use client";

import { SectionCard } from "@/features/account/SectionCard";

export function LabReportsSection() {
  return (
    <SectionCard
      title="Lab Reports"
      description="Your test results and reports will appear here."
    >
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-100 bg-cream-100/40 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </span>
        <p className="text-sm font-medium text-sage-700">No lab reports yet</p>
        <p className="max-w-sm text-xs text-sage-400">
          When Dr. Surbhi&apos;s clinic shares your test results, they&apos;ll show up here for you
          to view and download.
        </p>
      </div>
    </SectionCard>
  );
}
