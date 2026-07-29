/**
 * Blog ("Success Stories") data, fetched on the server.
 *
 * These endpoints are public — no patient token — so unlike `lib/api.ts` this
 * uses a plain fetch with no Authorization header. Server-side means the posts
 * are in the HTML, which matters for search engines.
 */

import { API_BASE_URL, DOCTOR_SLUG } from "@/lib/config";

/** "video" is a file we host; "youtube"/"instagram" are third-party embeds. */
export type MediaType = "image" | "video" | "youtube" | "instagram";

export interface MediaItem {
  type: MediaType;
  url: string;
  /** Rich-text caption, sanitised by the API before storage. */
  description: string | null;
  youtube_id: string | null;
  instagram_id: string | null;
  instagram_kind: string | null;
  /** Plain-text form, for alt attributes (which cannot contain markup). */
  description_text: string | null;
}

export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  introduction: string;
  cover_image: string | null;
  category_name: string | null;
  category_slug: string | null;
  display_date: string | null;
  published_at: string | null;
}

export interface BlogPostDetail {
  title: string;
  slug: string;
  introduction: string;
  body: string | null;
  cover_image: string | null;
  category_name: string | null;
  category_slug: string | null;
  display_date: string | null;
  media: MediaItem[];
  tags: string[];
  published_at: string | null;
}

export interface BlogCategory {
  name: string;
  slug: string;
  post_count: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface Paged<T> {
  items: T[];
  meta: PageMeta;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Returns null on any failure so a page can render a friendly empty state. */
async function getPublic<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = (await response.json()) as Envelope<T>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

const BASE = `/doctors/public/${encodeURIComponent(DOCTOR_SLUG)}`;

export function fetchBlogPosts(
  options: { category?: string; page?: number; limit?: number } = {},
): Promise<Paged<BlogPostCard> | null> {
  const params = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 9),
  });
  if (options.category) params.set("category", options.category);
  return getPublic<Paged<BlogPostCard>>(`${BASE}/gallery?${params.toString()}`);
}

export function fetchBlogCategories(): Promise<BlogCategory[] | null> {
  return getPublic<BlogCategory[]>(`${BASE}/gallery/categories`);
}

export function fetchBlogPost(
  postSlug: string,
): Promise<BlogPostDetail | null> {
  return getPublic<BlogPostDetail>(
    `${BASE}/gallery/${encodeURIComponent(postSlug)}`,
  );
}

/** Only the bits the public site needs; `section_label` is the section's name. */
export interface PublicSiteSettings {
  gallery_enabled: boolean;
  section_label: string;
}

export function fetchSiteSettings(): Promise<PublicSiteSettings | null> {
  return getPublic<PublicSiteSettings>(`${BASE}/settings`);
}

/** Media paths are relative on local disk and absolute on cloud storage. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL.replace(/\/api\/v1\/?$/, "")}${path}`;
}

export function formatPostDate(
  post: { display_date: string | null; published_at: string | null },
  style: "short" | "long" = "short",
): string | null {
  const raw = post.display_date ?? post.published_at;
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.valueOf())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}
