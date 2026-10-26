import { HeroBlobs } from "./hero-blobs";
import type { JobApplicationVariant } from "@/lib/types";

/** A semi-transparent scrim over uploaded image/video backgrounds so the
 * hero copy stays legible regardless of what gets uploaded in Studio. */
const SCRIM = "absolute inset-0 bg-white/40 dark:bg-surface/60";

export function HeroBackground({ jdVariant }: { jdVariant?: JobApplicationVariant }) {
  if (jdVariant?.heroStyle === "image" && jdVariant.heroBackgroundImageUrl) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
        <img src={jdVariant.heroBackgroundImageUrl} alt="" className="h-full w-full object-cover" />
        <div className={SCRIM} />
      </div>
    );
  }

  if (jdVariant?.heroStyle === "video" && jdVariant.heroBackgroundVideoUrl) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <video
          src={jdVariant.heroBackgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className={SCRIM} />
      </div>
    );
  }

  return <HeroBlobs />;
}
