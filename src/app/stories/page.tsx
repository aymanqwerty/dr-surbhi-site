import type { Metadata } from "next";
import Link from "next/link";

import { PostCoverImage } from "@/components/blog/PostCoverImage";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  fetchBlogCategories,
  fetchBlogPosts,
  fetchSiteSettings,
  formatPostDate,
} from "@/lib/blog-api";

const PAGE_SIZE = 9;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const label = settings?.section_label ?? "Success Stories";
  return {
    title: `${label} | Dr. Surbhi Patne`,
    description: `Stories, updates and milestones from Dr. Surbhi Patne's practice.`,
  };
}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [settings, result, categories] = await Promise.all([
    fetchSiteSettings(),
    fetchBlogPosts({ category, page, limit: PAGE_SIZE }),
    fetchBlogCategories(),
  ]);

  const label = settings?.section_label ?? "Success Stories";
  const posts = result?.items ?? [];
  const totalPages = result?.meta.total_pages ?? 0;

  const hrefFor = (nextCategory?: string, nextPage = 1) => {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return `/stories${query ? `?${query}` : ""}`;
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage-900 sm:text-4xl">
          {label}
        </h1>
        <div className="hairline-gold mt-4 w-20" />

        {categories && categories.length > 0 && (
          <nav
            className="mt-8 flex flex-wrap gap-2.5"
            aria-label="Filter by category"
          >
            <Link
              href={hrefFor()}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                !category
                  ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                  : "border-sage-200 bg-white/70 text-sage-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              All
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={hrefFor(item.slug)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  category === item.slug
                    ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                    : "border-sage-200 bg-white/70 text-sage-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {item.name}
                <span className="ml-1.5 text-xs opacity-70">
                  {item.post_count}
                </span>
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-sage-200 bg-white/70 p-12 text-center text-sage-500">
            Nothing published here yet. Please check back soon.
          </p>
        ) : (
          <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const date = formatPostDate(post);
              return (
                <li key={post.id} className="flex">
                  {/* The whole card is one link. "Read more" is a span, since
                      nesting anchors is invalid HTML and breaks focus order. */}
                  <Link
                    href={`/stories/${post.slug}`}
                    className="group flex w-full flex-col overflow-hidden rounded-2xl border border-sage-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-cream-100">
                      <PostCoverImage
                        src={post.cover_image}
                        alt={post.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      {date && (
                        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-sage-800">
                          {date}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2.5 p-6">
                      {post.category_name && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                          {post.category_name}
                        </span>
                      )}
                      <h2 className="text-lg font-semibold leading-snug text-sage-900 transition-colors group-hover:text-brand-700">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-relaxed text-sage-600">
                        {post.introduction}
                      </p>
                      <span className="mt-auto pt-3 text-sm font-semibold text-brand-600">
                        Read more →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-3"
            aria-label="Pagination"
          >
            {page > 1 && (
              <Link
                href={hrefFor(category, page - 1)}
                className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-sage-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={hrefFor(category, page + 1)}
                className="rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </main>

      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
