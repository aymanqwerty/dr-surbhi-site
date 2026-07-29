import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCoverImage } from "@/components/blog/PostCoverImage";
import { RichText } from "@/components/blog/RichText";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  fetchBlogPost,
  fetchSiteSettings,
  formatPostDate,
  mediaUrl,
} from "@/lib/blog-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}): Promise<Metadata> {
  const { postSlug } = await params;
  const post = await fetchBlogPost(postSlug);
  if (!post) return { title: "Post not found | Dr. Surbhi Patne" };
  return {
    title: `${post.title} | Dr. Surbhi Patne`,
    description: post.introduction.slice(0, 160),
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const [post, settings] = await Promise.all([
    fetchBlogPost(postSlug),
    fetchSiteSettings(),
  ]);

  if (!post) notFound();

  const label = settings?.section_label ?? "Success Stories";
  const date = formatPostDate(post, "long");

  const images = post.media.filter((item) => item.type === "image");
  const uploadedVideos = post.media.filter((item) => item.type === "video");
  const videos = post.media.filter(
    (item) => item.type === "youtube" && item.youtube_id,
  );
  const socials = post.media.filter((item) => item.type === "instagram");

  return (
    <div className="min-h-screen">
      <Header />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/stories"
          className="text-sm font-medium text-sage-500 transition-colors hover:text-brand-600"
        >
          ← Back to {label}
        </Link>

        <header className="mt-6 flex flex-col gap-4">
          {post.category_name && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
              {post.category_name}
            </span>
          )}
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-sage-900 sm:text-4xl">
            {post.title}
          </h1>
          {date && (
            <time className="text-sm text-sage-500">{date}</time>
          )}
          <div className="hairline-gold w-20" />
        </header>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-cream-100 shadow-soft">
          <PostCoverImage
            src={post.cover_image}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <p className="mt-8 text-lg leading-relaxed text-sage-700">
          {post.introduction}
        </p>

        <RichText
          html={post.body}
          className="mt-6 leading-relaxed text-sage-700"
        />

        {images.length > 0 && (
          <section className="mt-10 flex flex-col gap-8">
            {images.map((item, index) => (
              <figure key={`${item.url}-${index}`} className="flex flex-col gap-3">
                <Image
                  src={mediaUrl(item.url)}
                  alt={item.description_text ?? post.title}
                  width={900}
                  height={600}
                  className="w-full rounded-2xl shadow-soft"
                />
                {item.description && (
                  <figcaption>
                    <RichText
                      html={item.description}
                      className="text-sm leading-relaxed text-sage-600"
                    />
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        {uploadedVideos.length > 0 && (
          <section className="mt-10 flex flex-col gap-8">
            {uploadedVideos.map((item, index) => (
              <figure key={`${item.url}-${index}`} className="flex flex-col gap-3">
                <video
                  src={mediaUrl(item.url)}
                  controls
                  playsInline
                  // Only the first frame until the patient hits play — these
                  // are self-hosted, so every byte is billed egress.
                  preload="metadata"
                  className="w-full rounded-2xl bg-black shadow-soft"
                />
                {item.description && (
                  <figcaption>
                    <RichText
                      html={item.description}
                      className="text-sm leading-relaxed text-sage-600"
                    />
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        {videos.length > 0 && (
          <section className="mt-10 flex flex-col gap-8">
            {videos.map((item, index) => (
              <figure key={`${item.url}-${index}`} className="flex flex-col gap-3">
                <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-soft">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${item.youtube_id}`}
                    title={item.description_text ?? `Video ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
                {item.description && (
                  <figcaption>
                    <RichText
                      html={item.description}
                      className="text-sm leading-relaxed text-sage-600"
                    />
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        {socials.length > 0 && (
          <section className="mt-10 flex flex-col gap-6">
            {socials.map((item, index) => (
              <div
                key={`${item.url}-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-sage-200/80 bg-white p-5 shadow-soft"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Instagram
                </span>

                {/* Instagram's /embed/ iframe needs no API key. Private or
                    age-gated posts render empty, so the link below always
                    stays as a way through. */}
                {item.instagram_id && (
                  <div
                    className={
                      item.instagram_kind === "reel"
                        ? "mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-xl border border-sage-200"
                        : "mx-auto h-[640px] w-full max-w-lg overflow-hidden rounded-xl border border-sage-200"
                    }
                  >
                    <iframe
                      src={`https://www.instagram.com/${item.instagram_kind}/${item.instagram_id}/embed`}
                      title={item.description_text ?? `Instagram post ${index + 1}`}
                      loading="lazy"
                      allowFullScreen
                      scrolling="no"
                      className="h-full w-full border-0"
                    />
                  </div>
                )}

                {/* Prose, not a link — only the button below is clickable. */}
                <RichText
                  html={item.description}
                  className="text-sm leading-relaxed text-sage-600"
                />

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sage-200 px-4 py-2 text-sm font-semibold text-sage-700 transition hover:border-brand-300 hover:text-brand-600"
                >
                  View on Instagram ↗
                </a>
              </div>
            ))}
          </section>
        )}

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2 border-t border-sage-200/60 pt-6">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-sage-200 px-3 py-1 text-xs text-sage-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>

      <Footer phone="+91 8225978199" email="surpatne@gmail.com" />
    </div>
  );
}
