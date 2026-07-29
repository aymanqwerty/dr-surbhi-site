/**
 * Render doctor-authored rich text.
 *
 * The HTML is sanitised server-side against a strict allowlist before storage,
 * so this is safe. Everything that shows a description must go through here —
 * printing it as plain text leaks literal `<p>` tags onto the page.
 */
export function RichText({
  html,
  className = "",
}: {
  html: string | null | undefined;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={`[&_a]:text-brand-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gold-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-sage-900 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-sage-900 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
