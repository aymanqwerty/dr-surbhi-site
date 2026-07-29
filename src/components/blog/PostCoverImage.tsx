"use client";

import Image from "next/image";
import { useState } from "react";

import { mediaUrl } from "@/lib/blog-api";

/** Bundled placeholder for posts with no cover, or a cover that won't load. */
export const DEFAULT_COVER = "/default-cover.svg";

/**
 * Cover image with a built-in fallback.
 *
 * A missing cover could be handled on the server, but an image that 404s or
 * fails to decode is only detectable in the browser — hence the client
 * component and the onError swap.
 */
export function PostCoverImage({
  src,
  alt,
  sizes,
  priority,
  className = "object-cover",
}: {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? DEFAULT_COVER : mediaUrl(src);

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
      // The placeholder is a local SVG; optimizing it adds nothing and would
      // require dangerouslyAllowSVG.
      unoptimized={resolved === DEFAULT_COVER}
    />
  );
}
