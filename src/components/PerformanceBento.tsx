import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CarVariant, BentoCard } from "../types";
import { BENTO_CARDS } from "../data";
import { audioSynth } from "../utils/audioSynth";

interface PerformanceBentoProps {
  activeVariant: CarVariant;
  onExplorePerformanceClick: () => void;
}

interface BentoCardComponentProps {
  card: BentoCard;
  activeVariant: CarVariant;
  index: number;
}

function BentoCardComponent({ card, activeVariant, index }: BentoCardComponentProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Card tilt motion values
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const reflectionX = useMotionValue("50%");
  const reflectionY = useMotionValue("50%");

  // Spring animations for 3D physics
  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalizing coordinates from -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Tilt limits
    rotateX.set(-normY * 5); // Tilt vertical
    rotateY.set(normX * 5);  // Tilt horizontal

    // Reflection coordinates inside the card container
    reflectionX.set(`${x}px`);
    reflectionY.set(`${y}px`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    audioSynth.playClick();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className="group bg-[#0c0c0c]/90 border border-white/10 hover:border-white/20 rounded-sm overflow-hidden flex flex-col justify-between h-full relative cursor-pointer"
      animate={{
        y: hovered ? -8 : 0,
        borderColor: hovered ? `${activeVariant.hex}40` : "rgba(255, 255, 255, 0.1)",
        boxShadow: hovered
          ? `0 20px 40px -15px ${activeVariant.hex}20`
          : "0 4px 20px rgba(0, 0, 0, 0)",
      }}
    >
      {/* Dynamic 3D lighting reflection sweep overlay */}
      <motion.div
        style={{
          background: useTransform(
            [reflectionX, reflectionY],
            ([x, y]) => `radial-gradient(circle 200px at ${x} ${y}, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)`
          ),
          opacity: hovered ? 1 : 0,
        }}
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
      />

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/45 z-10 transition-opacity group-hover:opacity-15 duration-500" />
        <motion.img
          src={card.imageUrl}
          alt={card.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter contrast-105 brightness-90"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between z-10">
        <div className="space-y-2">
          {/* Category Label */}
          <span
            className="text-[10px] md:text-xs font-mono font-black tracking-widest uppercase transition-colors"
            style={{ color: hovered ? activeVariant.hex : "#9ca3af" }}
          >
            {card.category}
          </span>
          {/* Title */}
          <h3 className="text-base font-bold text-white uppercase tracking-tight leading-snug">
            {card.title}
          </h3>
        </div>
        {/* Description */}
        <motion.p
          animate={{ y: hovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-gray-400 leading-relaxed transition-colors group-hover:text-gray-300"
        >
          {card.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function PerformanceBento({ activeVariant, onExplorePerformanceClick }: PerformanceBentoProps) {
  return (
    <section
      id="performance"
      className="relative bg-black text-white py-20 md:py-32 border-b border-white/10 overflow-hidden"
    >
      {/* Background radial highlight */}
      <div
        className="absolute bottom-0 left-0 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: activeVariant.hex }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Context Text */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6 lg:sticky lg:top-32">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: activeVariant.hex }}>
                TRACK DNA
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-display text-white">
                BORN ON<br />
                THE TRACK.
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
              Motorsport technology meets everyday driveability. The 911 GT3 RS is engineered to deliver maximum racetrack performance with surgical steering precision and uncompromising control.
            </p>
            <div className="pt-2">
              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  onExplorePerformanceClick();
                }}
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                variants={{
                  hover: {
                    scale: 1.03,
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.12)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 border border-white/20 text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-md"
                id="bento-explore-btn"
              >
                <span>EXPLORE PERFORMANCE</span>
                <motion.span
                  variants={{ hover: { x: 4 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" style={{ color: activeVariant.hex }} />
                </motion.span>
              </motion.button>
            </div>
          </div>

          {/* Right Column: 3-Card Layout */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENTO_CARDS.map((card, index) => (
              <BentoCardComponent
                key={card.id}
                card={card}
                activeVariant={activeVariant}
                index={index}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
