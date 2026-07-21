import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-soft",
  secondary: "bg-sage-500 text-white hover:bg-sage-600 shadow-soft",
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
