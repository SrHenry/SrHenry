"use client";

import { useState } from "react";
import { GRAVATAR_EMAIL_HASH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getGravatarFallback, getGravatarUrl } from "@/lib/utils/gravatar";

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
  initials?: string;
}

export function Avatar({ src, alt, className, size = 128, initials = "SH" }: AvatarProps) {
  const imageSrc = src || getGravatarUrl(GRAVATAR_EMAIL_HASH, size);
  const fallbackSrc = getGravatarFallback(initials);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn("overflow-hidden rounded-full border-2 border-border", className)}
      style={{ width: size, height: size }}
    >
      {/* biome-ignore lint/performance/noImgElement: onError handler can't be serialized through Server Component boundary */}
      <img
        src={failed ? fallbackSrc : imageSrc}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
