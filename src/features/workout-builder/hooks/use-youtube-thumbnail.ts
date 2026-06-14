import { useState } from "react";
import { getYouTubeThumbnailUrl, getNextThumbnailQuality, type YouTubeThumbnailQuality } from "@/shared/lib/youtube";

/**
 * Hook that upgrades YouTube thumbnail URLs from hqdefault (480×360)
 * to maxresdefault (1280×720 HD) with automatic cascading fallback.
 *
 * Fallback order: maxresdefault → sddefault → hqdefault → null (icon fallback)
 *
 * @param originalUrl The fullVideoImageUrl from the database (typically hqdefault.jpg)
 * @returns An object with the resolved thumbnail src and an error handler for <Image onError>
 */
export function useYouTubeThumbnail(originalUrl: string | null | undefined) {
  const [quality, setQuality] = useState<YouTubeThumbnailQuality>("maxresdefault");
  const [exhausted, setExhausted] = useState(false);

  const src = originalUrl && !exhausted ? getYouTubeThumbnailUrl(originalUrl, quality) : null;

  const handleError = () => {
    const next = getNextThumbnailQuality(quality);
    if (next) {
      setQuality(next);
    } else {
      setExhausted(true);
    }
  };

  return { src, handleError, isUnavailable: exhausted };
}
