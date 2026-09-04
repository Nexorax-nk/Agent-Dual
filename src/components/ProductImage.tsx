'use client';

import { useState } from 'react';
import Image from 'next/image';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='20'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export function ProductImage({ src, alt, className }: { src: string | null, alt: string, className?: string }) {
  const [error, setError] = useState(false);

  const finalSrc = error || !src ? FALLBACK_IMAGE : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      className={className}
      width={400}
      height={400}
      onError={() => setError(true)}
    />
  );
}
