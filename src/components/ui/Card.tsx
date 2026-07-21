import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-brand-100 bg-white p-6 shadow-card ${className}`}
      {...props}
    />
  );
}
