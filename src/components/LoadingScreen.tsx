import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [pct, setPct] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Smooth loading animation from 0 to 100% over 2.6 seconds
    const controls = animate(0, 100, {
      duration: 2.6,
      ease: [0.22, 1, 0.36, 1], // Premium easeOut curve
      onUpdate: (latest) => {
        setPct(Math.round(latest));
      },
      onComplete: () => {
        setIsFading(true);
        // Delay completion slightly to allow the screen fade transition to execute
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    });

    return () => controls.stop();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          key="loader-screen"
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            // High fidelity premium carbon fiber weave background
            backgroundImage: `
              linear-gradient(45deg, #070707 25%, transparent 25%), 
              linear-gradient(-45deg, #070707 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #070707 75%), 
              linear-gradient(-45deg, transparent 75%, #070707 75%)
            `,
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px"
          }}
        >
          {/* Injecting smooth floating dust animation keyframes */}
          <style>{`
            @keyframes floatParticles {
              0% { transform: translateY(0) translateX(0); opacity: 0; }
              10% { opacity: 0.2; }
              90% { opacity: 0.2; }
              100% { transform: translateY(-90px) translateX(20px); opacity: 0; }
            }
          `}</style>

          {/* Faint Center Radial Light Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_center,rgba(255,255,255,0.012)_0%,transparent_100%)] pointer-events-none z-[1]" />

          {/* Micro Floating Dust Particles Layer */}
          <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
            {Array.from({ length: 25 }).map((_, idx) => {
              const size = Math.random() * 2 + 1;
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const delay = Math.random() * 8;
              const duration = 12 + Math.random() * 10;
              return (
                <div
                  key={idx}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: size,
                    height: size,
                    left: `${left}%`,
                    top: `${top}%`,
                    animation: `floatParticles ${duration}s infinite linear`,
                    animationDelay: `${delay}s`
                  }}
                />
              );
            })}
          </div>

          <div className="relative flex flex-col items-center justify-center z-[5] text-center">
            {/* Minimal Brand Script Logo */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white font-sans font-black tracking-[0.75em] text-sm md:text-base uppercase leading-none pl-3"
            >
              PORSCHE
            </motion.h1>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-[7.5px] font-mono tracking-[0.45em] text-gray-500 uppercase mt-2.5 block pl-1"
            >
              MOTORSPORT
            </motion.span>

            {/* Premium Loading Progress Bar */}
            <div className="w-60 h-[2.5px] bg-white/10 mt-10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Percentage Readout */}
            <span className="text-[9px] font-mono tracking-widest text-white/45 mt-4 block">
              {pct}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
