import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  // Plum-rose, with a quiet hover lift.
  primary:
    "bg-brand-500 text-white shadow-soft hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
  // Warm ink — an elegant dark counterpart to the plum.
  secondary:
    "bg-sage-800 text-cream-50 shadow-soft hover:bg-sage-900 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
  ghost: "bg-transparent text-sage-700 hover:bg-sage-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
