import { useRef } from "react";
import { HERO_VIDEO_SRC } from "./guestData";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="absolute inset-0">

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        {/* Place your file at: public/videos/hero-drone.mp4 */}
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

    </div>
  );
}
