import { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-sage-100 text-sage-700",
  success: "bg-sage-200 text-sage-800",
  warning: "bg-brand-100 text-brand-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
