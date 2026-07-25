import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-sage-200/70 bg-white p-6 shadow-card ${className}`}
      {...props}
    />
  );
}
