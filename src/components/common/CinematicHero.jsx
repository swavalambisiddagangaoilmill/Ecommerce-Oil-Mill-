// Shared CinematicHero component used across pages.
import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export const DEMO_HERO_VIDEO = "https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4";

export default function CinematicHero({ eyebrow, title, text, image, video, posterLabel, contentVisible = true }) {
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(video) && !videoFailed;

  return (
    <section className="pt-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative min-h-[420px] overflow-hidden bg-ink shadow-soft sm:min-h-[500px] lg:min-h-[620px]"
      >
        {showVideo ? (
          <video
            src={video}
            poster={image}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="metadata"
            controls={false}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={(event) => event.preventDefault()}
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
          />
        ) : (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        )}
        {contentVisible && <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/52 to-ink/16" />}
        {showVideo && (
          <button
            type="button"
            aria-label={muted ? "Unmute hero video" : "Mute hero video"}
            className="absolute left-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-8 sm:top-8"
            onClick={() => setMuted((current) => !current)}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
        )}
        {contentVisible && (
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10 2xl:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/72">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{text}</p>
          </div>
        )}
        {contentVisible && posterLabel && (
          <div className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:right-8 sm:top-8">
            {posterLabel}
          </div>
        )}
      </motion.div>
    </section>
  );
}
