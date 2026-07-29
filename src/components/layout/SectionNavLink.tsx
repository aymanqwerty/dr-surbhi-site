"use client";

import Link from "next/link";

import { usePublicSettings } from "@/lib/hooks";

/**
 * Nav link to the blog section, labelled with whatever the doctor called it.
 *
 * This is a client component on purpose: `Header` is rendered from both server
 * pages and the client-side account layout, so it can't be async and fetch the
 * label itself. The query is shared through react-query, so all the places
 * this appears cost one request, and it falls back to the API's own default
 * until that resolves.
 *
 * Hidden entirely when the doctor has switched the section off.
 */
export function SectionNavLink({ className }: { className?: string }) {
  const { data: settings } = usePublicSettings();

  if (settings && !settings.gallery_enabled) return null;

  return (
    <Link href="/stories" className={className}>
      {settings?.section_label ?? "Success Stories"}
    </Link>
  );
}
