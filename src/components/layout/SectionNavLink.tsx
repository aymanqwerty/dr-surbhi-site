"use client";

import Link from "next/link";

import { useBlogCategories, usePublicSettings } from "@/lib/hooks";

/**
 * Nav link to the blog section, labelled with whatever the doctor called it,
 * with the available categories on hover.
 *
 * A client component on purpose: `Header` renders from both server pages and
 * the client-side account layout, so it can't be async and fetch the label
 * itself. Both queries are shared through react-query, so appearing in several
 * places costs one request each.
 *
 * Hidden entirely when the doctor has switched the section off.
 */
export function SectionNavLink({ className }: { className?: string }) {
  const { data: settings } = usePublicSettings();
  const { data: categories } = useBlogCategories();

  if (settings && !settings.gallery_enabled) return null;

  const label = settings?.section_label ?? "Success Stories";
  const items = categories ?? [];

  return (
    // `group` drives the dropdown. focus-within is included so the menu is
    // reachable by keyboard, not just by mouse.
    <div className="group relative">
      <Link href="/stories" className={className}>
        {label}
      </Link>

      {items.length > 0 && (
        <div
          className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
          // The pt-4 above is a deliberate hover bridge: without it the menu
          // closes while the pointer crosses the gap from link to panel.
        >
          <div className="min-w-[13rem] overflow-hidden rounded-2xl border border-sage-200/80 bg-white/95 py-2 shadow-lift backdrop-blur">
            <p className="px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sage-400">
              Browse by category
            </p>
            <Link
              href="/stories"
              className="flex items-center justify-between gap-4 px-4 py-2 text-sm text-sage-700 transition-colors hover:bg-cream-50 hover:text-brand-600"
            >
              All posts
            </Link>
            {items.map((category) => (
              <Link
                key={category.slug}
                href={`/stories?category=${encodeURIComponent(category.slug)}`}
                className="flex items-center justify-between gap-4 px-4 py-2 text-sm text-sage-700 transition-colors hover:bg-cream-50 hover:text-brand-600"
              >
                <span className="truncate">{category.name}</span>
                <span className="shrink-0 rounded-full bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-sage-500">
                  {category.post_count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
