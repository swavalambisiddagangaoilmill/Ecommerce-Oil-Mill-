import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];
const INTRO_DURATION = 2800;
const EXIT_DURATION = 520;

function Background() {
  return (
    <div className="absolute inset-0 bg-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,249,235,0.98)_0%,rgba(247,240,227,0.96)_54%,rgba(236,222,199,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(201,169,110,0.16)_0%,rgba(201,169,110,0.05)_34%,transparent_68%)]" />
    </div>
  );
}

function IntroScreen({ reduced }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0.25 : 0.78, ease: EASE_OUT }}
    >
      <div className="relative grid place-items-center">
        <div className="absolute h-[min(360px,64vw)] w-[min(360px,64vw)] rounded-full bg-clay/14 blur-3xl" />
        <motion.img
          src="/namaste.svg"
          alt="Namaste"
          draggable={false}
          className="relative h-[min(250px,48vw)] w-[min(250px,48vw)] object-contain drop-shadow-[0_22px_44px_rgba(63,43,31,0.16)]"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.95, filter: reduced ? "none" : "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: reduced ? 0.25 : 0.78, ease: EASE_OUT }}
        />
      </div>
      <motion.p
        className="mt-8 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.18, duration: reduced ? 0.25 : 0.62, ease: EASE_OUT }}
      >
        Swavalambi Siddaganga Oil Mill
      </motion.p>
      <motion.p
        className="mt-4 text-xs font-bold uppercase tracking-[0.32em] text-clay sm:text-sm"
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.32, duration: reduced ? 0.25 : 0.48, ease: EASE_OUT }}
      >
        Work is Worship
      </motion.p>
    </motion.div>
  );
}

function LoaderAnimation({ reduced, exiting }) {
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="ss-oil-mill-intro"
          className="fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.25 : EXIT_DURATION / 1000, ease: EASE_IN_OUT }}
          role="status"
          aria-label="Loading Swavalambi Siddaganga Oil Mill"
        >
          <Background />
          <IntroScreen reduced={reduced} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function IntroLoader({ children }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("ssOilMillIntroSeen")) {
      return "skip";
    }
    return "playing";
  });
  const holdTimer = useRef(null);
  const exitTimer = useRef(null);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const totalDuration = reduced ? 1000 : INTRO_DURATION;
    const exitDuration = reduced ? 280 : EXIT_DURATION;

    holdTimer.current = window.setTimeout(() => {
      setPhase("exiting");
      exitTimer.current = window.setTimeout(() => {
        sessionStorage.setItem("ssOilMillIntroSeen", "true");
        setPhase("done");
      }, exitDuration);
    }, totalDuration);

    return () => {
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(exitTimer.current);
    };
  }, [phase, reduced]);

  if (phase === "skip" || phase === "done") return children;

  return (
    <>
      {phase === "exiting" && children}
      <LoaderAnimation reduced={reduced} exiting={phase === "exiting"} />
    </>
  );
}
