/**
 * Mobile-number input: a fixed "+91" prefix (never typed) with a digit-only,
 * 10-digit-capped field. Callers validate `value.length === 10` on submit.
 * Shared by login and the booking forms so phone entry is identical everywhere.
 */
export function PhoneField({
  id,
  value,
  onChange,
  placeholder = "10-digit mobile number",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-sage-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
      <span className="flex items-center border-r border-sage-200 bg-sage-50 px-3 text-sm font-medium text-sage-600">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        className="min-w-0 flex-1 bg-white px-4 py-2.5 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none"
      />
    </div>
  );
}
