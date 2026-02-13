import Image from 'next/image';
import { getGravatarUrl, getGravatarFallback } from '@/lib/utils/gravatar';
import { GRAVATAR_EMAIL_HASH } from '@/lib/constants';

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  size?: number;
  initials?: string;
}

export function Avatar({
  src,
  alt,
  className = '',
  size = 128,
  initials = 'SH',
}: AvatarProps) {
  const imageSrc = src || getGravatarUrl(GRAVATAR_EMAIL_HASH, size);
  const fallbackSrc = getGravatarFallback(initials);

  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
        onError={(e) => {
          const target = e.currentTarget;
          target.src = fallbackSrc;
        }}
      />
    </div>
  );
}
