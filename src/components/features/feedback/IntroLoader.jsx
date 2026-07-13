import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Easing curves â€” only premium, no bounce/elastic
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1];
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Particle generation
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateParticles(count = 16) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2,
    delay: Math.random() * 0.6,
    duration: 3.5 + Math.random() * 2,
    driftX: (Math.random() - 0.5) * 30,
    driftY: -(10 + Math.random() * 25),
    opacity: 0.06 + Math.random() * 0.12,
  }));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Sub-components (animations untouched)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Particle({ p, reduced }) {
  if (reduced) return null;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        backgroundColor: "#c9a96e",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, p.opacity, p.opacity * 0.6, 0],
        y: [0, p.driftY * 0.5, p.driftY],
        x: [0, p.driftX * 0.4, p.driftX],
      }}
      transition={{
        delay: 0.15 + p.delay,
        duration: p.duration,
        ease: "easeInOut",
        times: [0, 0.3, 0.7, 1],
      }}
    />
  );
}

function GoldenGlow({ reduced }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ willChange: "opacity" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: reduced ? 0.4 : 1 }}
      transition={{ delay: 0.7, duration: 0.9, ease: EASE_OUT_EXPO }}
    >
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -56%)",
          width: "min(460px, 80vw)",
          height: "min(460px, 80vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.07) 40%, transparent 72%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -56%)",
          width: "min(240px, 50vw)",
          height: "min(240px, 50vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(245,230,190,0.14) 0%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}

function LightSweep({ reduced }) {
  if (reduced) return null;
  return (
    <motion.div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -56%)",
        width: "min(180px, 38vw)",
        height: "min(180px, 38vw)",
        borderRadius: "50%",
        willChange: "opacity",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        delay: 0.9,
        duration: 0.55,
        ease: EASE_IN_OUT_QUART,
        times: [0, 0.4, 1],
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,248,230,0.38) 50%, transparent 70%)",
          willChange: "transform",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "160%" }}
        transition={{ delay: 0.9, duration: 0.55, ease: EASE_IN_OUT_QUART }}
      />
    </motion.div>
  );
}

function LogoMark({ reduced }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      style={{
        width: "min(260px, 48vw)",
        height: "min(260px, 48vw)",
        willChange: "transform, opacity, filter",
      }}
      initial={{
        opacity: 0,
        scale: 0.88,
        y: 10,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        delay: 0.3,
        duration: reduced ? 0.4 : 0.72,
        ease: EASE_OUT_EXPO,
      }}
    >
      <img
        src="/namaste.svg"
        alt="Velora namaste mark"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
        }}
      />
    </motion.div>
  );
}

const NAMASTE_CHARS = "NAMASTE".split("");

function NamasteText({ reduced }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-[0.18em]"
      aria-label="Namaste"
      initial="hidden"
      animate="visible"
    >
      {NAMASTE_CHARS.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(10px, 1.4vw, 15px)",
            letterSpacing: "0.35em",
            color: "#8b7355",
            textTransform: "uppercase",
            willChange: "transform, opacity, filter",
          }}
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(3px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                delay: reduced ? 0.5 : 1.05 + i * 0.045,
                duration: reduced ? 0.4 : 0.38,
                ease: EASE_OUT_QUINT,
              },
            },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.div>
  );
}

function VeloraText({ reduced }) {
  return (
    <motion.div
      style={{
        fontFamily:
          "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
        fontWeight: 300,
        fontSize: "clamp(36px, 7.5vw, 82px)",
        letterSpacing: "0.12em",
        color: "#2c2418",
        lineHeight: 1,
        willChange: "transform, opacity, filter",
      }}
      initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)", y: 4 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        delay: reduced ? 0.6 : 1.3,
        duration: reduced ? 0.4 : 0.52,
        ease: EASE_OUT_EXPO,
      }}
      aria-label="Velora"
    >
      Velora
    </motion.div>
  );
}

function TaglineText({ reduced }) {
  return (
    <motion.div
      style={{
        fontFamily:
          "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
        fontWeight: 400,
        fontSize: "clamp(9px, 1.2vw, 13px)",
        letterSpacing: "0.28em",
        color: "#a89070",
        textTransform: "uppercase",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduced ? 0.7 : 1.55,
        duration: reduced ? 0.4 : 0.45,
        ease: EASE_OUT_QUINT,
      }}
    >
      Cold Pressed Pantry Rituals
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Background: layered radial gradients + grain
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E`;

function Background({ reduced }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ willChange: "opacity" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.3 : 0.35, ease: "easeOut" }}
    >
      <div className="absolute inset-0" style={{ background: "#f7f2ea" }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 48%, #fdf6e8 0%, rgba(247,242,234,0) 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 18% 12%, rgba(245,234,210,0.45) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 85% 90%, rgba(220,208,190,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 50%, transparent 55%, rgba(180,165,140,0.22) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Exit variants (untouched)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const outerExitVariants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { delay: 2.15, duration: 0.32, ease: EASE_IN_OUT_QUART },
  },
};

const logoExitVariants = {
  visible: { scale: 1, opacity: 1 },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { delay: 2.15, duration: 0.32, ease: EASE_IN_OUT_QUART },
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LoaderAnimation â€” the cinematic screen
// (pure presentational, no gating logic here)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoaderAnimation({ reduced, exiting }) {
  const particles = useMemo(() => generateParticles(16), []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="velora-intro"
          variants={outerExitVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ willChange: "opacity" }}
          role="status"
          aria-label="Loading Velora"
        >
          {/* â”€â”€ Background â”€â”€ */}
          <Background reduced={reduced} />

          {/* â”€â”€ Particles â”€â”€ */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <Particle key={p.id} p={p} reduced={reduced} />
            ))}
          </div>

          {/* â”€â”€ Ambient glow â”€â”€ */}
          <GoldenGlow reduced={reduced} />

          {/* â”€â”€ Light sweep â”€â”€ */}
          <LightSweep reduced={reduced} />

          {/* â”€â”€ Main content column â”€â”€ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
            <motion.div
              variants={logoExitVariants}
              initial="visible"
              animate="visible"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              <LogoMark reduced={reduced} />
            </motion.div>

            <div
              className="flex flex-col items-center"
              style={{
                marginTop: "clamp(16px, 3.2vh, 28px)",
                gap: "clamp(6px, 1.2vh, 12px)",
              }}
            >
              <NamasteText reduced={reduced} />
              <VeloraText reduced={reduced} />
              <div style={{ marginTop: "clamp(4px, 0.8vh, 8px)" }}>
                <TaglineText reduced={reduced} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// IntroLoader â€” gatekeeper
//
// â€¢ While loading === true  â†’ render ONLY <LoaderAnimation>
//   Children are NOT mounted, NOT in the DOM.
// â€¢ After loading === false â†’ render children only.
//   The loader is fully gone; no overlay, no stacking.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function IntroLoader({ children }) {
  const reduced = useReducedMotion();

  // Three possible states:
  //   "skip"    â€” sessionStorage key already set; skip immediately to children
  //   "playing" â€” intro is running
  //   "exiting" â€” exit animation in progress (children still blocked)
  //   "done"    â€” hand off to children
  const [phase, setPhase] = useState(() => {
    // Initialiser runs synchronously before first paint â€”
    // if the key is already set we never show the loader at all.
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("veloraIntroSeen")
    ) {
      return "skip";
    }
    return "playing";
  });

  const holdTimer = useRef(null);
  const exitTimer = useRef(null);

  useEffect(() => {
    // Already skipped â€” nothing to schedule.
    if (phase === "skip") return;

    const totalDuration = reduced ? 1200 : 2500;
    const exitDuration = 400; // must cover the 0.32 s Framer exit + buffer

    // After the hold period, trigger the exit animation.
    holdTimer.current = setTimeout(() => {
      setPhase("exiting");

      // After the exit animation fully completes, unlock children.
      exitTimer.current = setTimeout(() => {
        sessionStorage.setItem("veloraIntroSeen", "true");
        setPhase("done");
      }, exitDuration);
    }, totalDuration);

    return () => {
      clearTimeout(holdTimer.current);
      clearTimeout(exitTimer.current);
    };
    // `reduced` is stable for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // â”€â”€ Gatekeeper branch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Children are rendered ONLY when phase is "skip" or "done".
  if (phase === "skip" || phase === "done") {
    return children;
  }

  // phase === "playing" | "exiting"
  // The application does not exist yet.
  return <LoaderAnimation reduced={reduced} exiting={phase === "exiting"} />;
}



