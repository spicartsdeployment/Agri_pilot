import { useRef, useState } from "react";
import { HERO_VIDEO_SRC, HERO_VIDEO_POSTER } from "./guestData";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="absolute inset-0">
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={HERO_VIDEO_POSTER}
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover"
        >
          {/* Place your file at: public/videos/hero-drone.mp4 */}
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <img src={HERO_VIDEO_POSTER} alt="Agricultural drone operations" className="w-full h-full object-cover" />
      )}
    </div>
  );
}
