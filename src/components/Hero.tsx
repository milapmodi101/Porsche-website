import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Play, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { CarVariant } from "../types";
import { audioSynth } from "../utils/audioSynth";

interface HeroProps {
  activeVariant: CarVariant;
  onVariantChange: (variant: CarVariant) => void;
  onExploreClick: () => void;
}

// 1. HIGH-PERFORMANCE INT SHIELD ANIMATED COUNTER WITH SEQUENTIAL DELAY
interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
}

function AnimatedCounter({ value, decimals = 0, duration = 1200, delay = 0 }: AnimatedCounterProps) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = 0;
    let animationFrameId: number;

    const runDelay = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Ease out exponential easing
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startVal + (value - startVal) * ease;
        
        setDisplayVal(current);

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          setDisplayVal(value);
        }
      };
      animationFrameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(runDelay);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, delay]);

  return <span>{displayVal.toFixed(decimals)}</span>;
}

// 2. STAGGERED FUTURISTIC TELEMETRY DISPLAY (Bento Cards Removed)
interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  accentColor: string;
  index: number;
}

function StatCard({ label, value, unit, detail, accentColor, index }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const numericVal = parseFloat(value);
  const isFloat = value.includes(".");

  const handleMouseEnter = () => {
    setIsHovered(true);
    audioSynth.setTurboSpool(0.75); // Rev up the turbo synthesizer volume/pitch
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    audioSynth.setTurboSpool(0); // Wind down
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        delay: 0.8 + index * 0.1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => audioSynth.playClick()}
      className="relative p-6 bg-white/[0.015] border border-white/5 hover:border-white/10 rounded-sm cursor-pointer group flex flex-col justify-between"
      style={{
        transform: isHovered ? "translateY(-6px)" : "translateY(0px)",
        boxShadow: isHovered ? `0 12px 35px -10px ${accentColor}25` : "0 4px 20px rgba(0,0,0,0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div>
        {/* Dynamic value counter */}
        <div className="flex items-baseline space-x-1">
          <span 
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter transition-all duration-300 font-sans leading-none" 
            style={{ 
              color: isHovered ? accentColor : "#ffffff",
              textShadow: isHovered ? `0 0 15px ${accentColor}40` : "none",
            }}
          >
            <AnimatedCounter value={numericVal} decimals={isFloat ? 1 : 0} delay={1200} duration={1500} />
          </span>
          {unit && (
            <span className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest">{unit}</span>
          )}
        </div>

        {/* Core label */}
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/90 mt-4 uppercase">
          {label}
        </p>

        {/* Detailed Description */}
        <motion.p 
          animate={{
            y: isHovered ? -2 : 0,
            opacity: isHovered ? 1 : 0.6,
          }}
          transition={{ duration: 0.3 }}
          className="text-[10px] text-gray-400 font-mono mt-2 tracking-wide line-clamp-2"
        >
          {detail}
        </motion.p>
      </div>

      {/* Sleek horizontal microtrace line */}
      <div className="w-full h-[1.5px] bg-white/5 mt-4 relative overflow-hidden">
        <motion.div 
          className="absolute inset-y-0 left-0 h-full"
          style={{ backgroundColor: accentColor }}
          animate={{
            width: isHovered ? "100%" : "30%",
            boxShadow: isHovered ? `0 0 8px ${accentColor}` : "none",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function Hero({ activeVariant, onVariantChange, onExploreClick }: HeroProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  // Framer Motion spring-accelerated coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 95, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 95, damping: 20 });

  // Luxury Parallax Mapping
  const bgX = useTransform(springX, (x) => x * -12);
  const bgY = useTransform(springY, (y) => y * -12);

  const smokeX = useTransform(springX, (x) => x * 20);
  const smokeY = useTransform(springY, (y) => y * 20);

  const glowX = useTransform(springX, (x) => x * 15);
  const glowY = useTransform(springY, (y) => y * 15);

  const typoX = useTransform(springX, (x) => x * -5);
  const typoY = useTransform(springY, (y) => y * -5);

  const carX = useTransform(springX, (x) => x * -8);
  const carY = useTransform(springY, (y) => y * -8);

  const contentX = useTransform(springX, (x) => x * -4);
  const contentY = useTransform(springY, (y) => y * -4);

  const particlesX = useTransform(springX, (x) => x * 30);
  const particlesY = useTransform(springY, (y) => y * 30);

  const gridX = useTransform(springX, (x) => x * -6);
  const gridY = useTransform(springY, (y) => y * -6);

  // Holographic Radial Grid glow following the cursor
  const gridMask = useTransform(
    [springX, springY],
    ([x, y]: [number, number]) => `radial-gradient(circle 350px at ${50 + x * 100}% ${50 + y * 100}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`
  );

  // Mouse Movement Callback
  const handleMouseMove = (e: React.MouseEvent) => {
    hasMoved.current = true;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Idle Movement Breathing to avoid freeze when mouse is stationary
  useEffect(() => {
    let idleAngle = 0;
    const interval = setInterval(() => {
      if (!hasMoved.current) {
        mouseX.set(Math.sin(idleAngle) * 0.08);
        mouseY.set(Math.cos(idleAngle) * 0.04);
        idleAngle += 0.012;
      }
    }, 30);
    return () => clearInterval(interval);
  }, [mouseX, mouseY]);

  const youtubeVideoId = "fPrcv-Hq958";

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      id="overview"
      className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. LAYERED BACKGROUND INTERACTIVE ENVIRONMENT */}
      
      {/* Video Background Layer */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none scale-105"
        style={{ x: bgX, y: bgY }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-[0.55] filter contrast-110"
          src="https://res.cloudinary.com/dqqxjay44/video/upload/v1782738217/Video_Project_8main_1_uvb8b4.mp4"
        />
        {/* Soft atmospheric gradient masking */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/75" />
      </motion.div>

      {/* Holographic Grid Pattern (Static Background Grid) */}
      <motion.div 
        style={{ x: gridX, y: gridY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none z-0" 
      />
      
      {/* Cursor Lighting Reactive Interactive Grid */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"
        style={{
          x: gridX,
          y: gridY,
          maskImage: gridMask,
          WebkitMaskImage: gridMask,
        }}
      />

      {/* Colored Dynamic Backlight Glow */}
      <motion.div
        className="absolute top-1/4 right-1/10 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[150px] md:blur-[220px] opacity-[0.18] pointer-events-none z-0 transition-colors duration-1000"
        style={{
          backgroundColor: activeVariant.hex,
          x: glowX,
          y: glowY,
        }}
      />

      {/* Slow moving atmospheric smoke loops */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen overflow-hidden opacity-[0.25]"
        style={{ x: smokeX, y: smokeY }}
      >
        <motion.div
          className="absolute bottom-1/6 left-1/4 w-[450px] h-[180px] bg-white/5 rounded-full blur-[90px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[350px] h-[120px] bg-white/4 rounded-full blur-[110px]"
          animate={{
            x: [0, -20, 20, 0],
            y: [0, 15, -10, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Atmospheric Volumetric Fog Haze */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-black via-white/[0.008] to-transparent pointer-events-none z-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Micro Floating Dust Particles Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        style={{ x: particlesX, y: particlesY }}
      >
        {[...Array(15)].map((_, idx) => {
          const size = Math.random() * 2 + 1;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          return (
            <motion.div
              key={idx}
              className="absolute rounded-full bg-white/35 pointer-events-none z-[1]"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.05, 0.25, 0.05],
              }}
              transition={{
                duration: 14 + Math.random() * 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* MAIN LAYOUT CONTAINER */}
      <div 
        className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-grow z-20 pt-28 pb-12 lg:py-24"
      >
        
        {/* LEFT BRANDING PANEL */}
        <motion.div 
          style={{ x: contentX, y: contentY }}
          className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8 z-30"
        >
          <div className="space-y-4">
            {/* Small tagline entrance */}
            <motion.div
              initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center space-x-3"
            >
              <motion.span
                className="inline-block w-8 h-[2px]"
                style={{ backgroundColor: activeVariant.hex }}
                layoutId="heroLine"
              />
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                MOTORSPORT adapted for the road
              </span>
            </motion.div>
            
            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 35, filter: "blur(12px)", scale: 0.95 }}
              animate={{ opacity: 0.95, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="leading-none uppercase tracking-tight font-display font-black text-4xl md:text-5xl lg:text-6xl text-white"
            >
              PORSCHE
            </motion.h1>
          </div>

          {/* Dynamic Variant Tagline and Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVariant.id}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase font-sans">
                {activeVariant.tagline}
              </h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-md">
                {activeVariant.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Luxury CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.button
              onClick={() => {
                audioSynth.playClick();
                onExploreClick();
              }}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              variants={{
                hover: {
                  scale: 1.04,
                  boxShadow: `0 0 25px ${activeVariant.hex}60`,
                  borderColor: activeVariant.hex,
                },
              }}
              className="px-7 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-black border border-transparent rounded-full flex items-center space-x-2.5 relative overflow-hidden group shadow-lg cursor-pointer"
              style={{
                backgroundColor: activeVariant.hex,
              }}
              id="hero-explore-btn"
            >
              {/* Expanding soft hover background */}
              <div className="absolute inset-0 bg-white/20 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 pointer-events-none" />
              <span className="relative z-10">
                EXPLORE PERFORMANCE
              </span>
              <motion.span
                variants={{ hover: { x: 4 } }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-10 flex items-center justify-center"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </motion.button>

            <motion.button
              onClick={() => {
                audioSynth.playClick();
                setIsVideoModalOpen(true);
              }}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              variants={{
                hover: {
                  scale: 1.04,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
              className="px-7 py-4 text-[10px] font-black tracking-[0.2em] uppercase border border-white/8 text-white rounded-full flex items-center space-x-2.5 bg-white/[0.02] group cursor-pointer shadow-md"
              id="hero-watch-btn"
            >
              <span>
                WATCH FILM
              </span>
              <motion.span
                variants={{ hover: { scale: 1.15 } }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="flex items-center justify-center"
              >
                <Play className="w-3 h-3 text-white fill-white" />
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Series Designation Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="pt-4 flex items-center space-x-3"
          >
            <span className="h-[2px] w-8 bg-white/20" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase">
              SERIES // 04 AUTOMOTIVE SHOWROOM
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT OVERLAPPING COLLAGE: MASSIVE TYPOGRAPHY + CAR ARTWORK WITH REFLECTIONS */}
        <div className="lg:col-span-7 relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[550px] flex items-center justify-center select-none z-10">
          
          {/* 3. MASSIVE MONOCHROME DISPLAY TYPOGRAPHY LAYER */}
          <motion.div
            style={{ x: typoX, y: typoY }}
            className="absolute inset-0 flex flex-col justify-center items-end pr-4 lg:pr-14 pointer-events-none select-none z-10 font-display"
          >
            <div className="flex flex-col items-end leading-[0.74] font-black tracking-tighter">
              <motion.span
                initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)", y: 55 }}
                animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-[140px] sm:text-[180px] md:text-[210px] lg:text-[230px] text-white tracking-tighter select-none font-sans"
              >
                911
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)", y: 55 }}
                animate={{ opacity: 0.11, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[140px] sm:text-[180px] md:text-[210px] lg:text-[230px] text-white tracking-tighter select-none font-sans"
              >
                GT3
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)", y: 55 }}
                animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-[140px] sm:text-[180px] md:text-[210px] lg:text-[230px] text-white tracking-tighter select-none font-sans"
              >
                RS
              </motion.span>
            </div>
          </motion.div>


        </div>
      </div>

      {/* BOTTOM GLASS STATISTICS BAR */}
      <div className="w-full border-t border-white/5 bg-black/[0.35] backdrop-blur-[20px] z-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8 relative">
          
          {/* Glass Spec Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              label={activeVariant.specs.horsepower.label}
              value={activeVariant.specs.horsepower.value}
              detail="Naturally Aspirated High-revving Flat Six Engine"
              accentColor={activeVariant.hex}
              index={0}
            />
            <StatCard
              label={activeVariant.specs.torque.label}
              value={activeVariant.specs.torque.value}
              unit={activeVariant.specs.torque.unit}
              detail="Maximum Crankcase Twisting Force Output"
              accentColor={activeVariant.hex}
              index={1}
            />
            <StatCard
              label={activeVariant.specs.acceleration.label}
              value={activeVariant.specs.acceleration.value}
              unit={activeVariant.specs.acceleration.unit}
              detail="Incredible Launch Control Sprint Speed"
              accentColor={activeVariant.hex}
              index={2}
            />
            <StatCard
              label={activeVariant.specs.topSpeed.label}
              value={activeVariant.specs.topSpeed.value}
              unit={activeVariant.specs.topSpeed.unit}
              detail="High-Speed Straight Aerodynamic Limit"
              accentColor={activeVariant.hex}
              index={3}
            />
          </div>
        </div>
      </div>

      {/* FILM MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <div className="absolute top-6 right-6 z-50">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-3 text-white bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full transition-colors duration-300 cursor-pointer"
                aria-label="Close video player"
                id="video-close-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden border border-white/10 shadow-2xl"
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0`}
                title="Porsche 911 GT3 RS Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
