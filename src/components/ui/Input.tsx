import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm text-sage-900 placeholder:text-sage-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";
