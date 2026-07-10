import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useMousePosition } from "../utils/useMousePosition";

export default function AmbientBackground() {
  const mouse = useMousePosition();
  
  // Springs to smooth out mouse movement
  const springX = useSpring(mouse.xNormal, { stiffness: 35, damping: 15 });
  const springY = useSpring(mouse.yNormal, { stiffness: 35, damping: 15 });
  
  // Spotlight coords
  const spotlightX = useTransform(springX, (x) => `${50 + x * 30}%`);
  const spotlightY = useTransform(springY, (y) => `${50 + y * 30}%`);
  
  const [particles, setParticles] = useState<{ id: number; size: number; left: number; top: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate pre-seeded floating dust particles
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 18 + Math.random() * 22,
      delay: Math.random() * -30, // Pre-seeded so they don't fade in from 0
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] select-none bg-[#020202]">
      {/* 1. Dynamic Moving Ambient Lighting Gradient */}
      <motion.div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]) => `radial-gradient(circle 700px at ${x} ${y}, rgba(80, 80, 80, 0.12) 0%, rgba(0, 0, 0, 0) 100%)`
          ),
        }}
      />

      {/* 2. Soft Volumetric Fog Clouds */}
      <div className="absolute inset-0 mix-blend-screen opacity-[0.06]">
        {/* Cloud Puff A */}
        <motion.div
          className="absolute -bottom-20 left-1/10 w-[70vw] h-[50vh] rounded-full bg-white/10 blur-[130px]"
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -15, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Cloud Puff B */}
        <motion.div
          className="absolute -top-20 right-1/10 w-[60vw] h-[45vh] rounded-full bg-white/8 blur-[140px]"
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 3. Slow-Moving Smoke Elements */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-screen">
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-[600px] h-[300px] bg-white/20 rounded-full blur-[150px]"
          animate={{
            rotate: [0, 360],
            x: [0, 50, -50, 0],
            y: [0, -25, 25, 0],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* 4. Subtle Floating Dust Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/30"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -180, 0],
              x: [0, Math.sin(p.id) * 40, 0],
              opacity: [0.03, 0.4, 0.03],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 5. Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
