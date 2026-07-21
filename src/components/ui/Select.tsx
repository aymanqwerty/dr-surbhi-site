import { SelectHTMLAttributes, forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm text-sage-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
