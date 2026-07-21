export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-sage-900">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-sage-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-sage-400">{label}</dt>
      <dd className="text-sm font-semibold text-sage-800">{value}</dd>
    </div>
  );
}
