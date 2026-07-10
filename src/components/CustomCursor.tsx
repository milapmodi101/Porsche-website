import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<string>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Motion values for raw mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer circle
  const springX = useSpring(cursorX, { stiffness: 220, damping: 25, mass: 0.6 });
  const springY = useSpring(cursorY, { stiffness: 220, damping: 25, mass: 0.6 });

  // Fast springs for inner dot
  const dotX = useSpring(cursorX, { stiffness: 850, damping: 45 });
  const dotY = useSpring(cursorY, { stiffness: 850, damping: 45 });

  useEffect(() => {
    // Detect mobile touch screen & small viewports
    const detectDevice = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(coarsePointer || isTouch || window.innerWidth < 1024);
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Global Hover Event Delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorAttr) {
        setHoverType(cursorAttr);
      } else if (target.closest("button") || target.closest('a[role="button"]') || target.closest('[id*="-btn"]')) {
        setHoverType("button");
      } else if (target.closest("a") || target.closest(".nav-link")) {
        const isHeaderNav = target.closest("nav") || target.closest("#app-header");
        setHoverType(isHeaderNav ? "nav" : "link");
      } else if (target.closest("[class*='card']") || target.closest(".bento-card")) {
        setHoverType("card");
      } else {
        setHoverType("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile || !isVisible) return null;

  // CSS variants mappings for outer circle shape & borders
  const getOuterVariants = () => {
    switch (hoverType) {
      case "button":
        return {
          width: 90,
          height: 40,
          borderRadius: "20px",
          border: "1.5px solid rgba(255, 255, 255, 0.4)",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(2px)",
        };
      case "scroll-top":
        return {
          width: 82,
          height: 82,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.08)",
        };
      case "card":
        return {
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          backgroundColor: "rgba(255, 255, 255, 0.015)",
          backdropFilter: "blur(4px)",
        };
      case "nav":
        return {
          width: 45,
          height: 45,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.55)",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        };
      case "view":
        return {
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.75)",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(6px)",
        };
      case "explore":
        return {
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.75)",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(6px)",
        };
      default:
        return {
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(0px)",
        };
    }
  };

  return (
    <>
      {/* Outer blurred ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono font-extrabold tracking-[0.2em] text-[9px] text-white shadow-lg"
        animate={getOuterVariants()}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
        style={{
          x: springX,
          y: springY,
        }}
      >
        <AnimatePresence mode="wait">
          {hoverType === "view" && (
            <motion.span
              key="view"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              VIEW
            </motion.span>
          )}
          {hoverType === "explore" && (
            <motion.span
              key="explore"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              EXPLORE
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner sharp pointer dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
        }}
      />
    </>
  );
}
