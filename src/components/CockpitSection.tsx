import React, { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CarVariant } from "../types";
import { audioSynth } from "../utils/audioSynth";

interface CockpitSectionProps {
  activeVariant: CarVariant;
  onExploreInteriorClick: () => void;
}

export default function CockpitSection({ activeVariant, onExploreInteriorClick }: CockpitSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Mouse Parallax variables
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 18 });

  // Map values for image position shifting
  const imgX = useTransform(springX, (x) => x * -20);
  const imgY = useTransform(springY, (y) => y * -20);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id="design"
      className="relative bg-black text-white py-20 md:py-32 border-b border-white/10 overflow-hidden"
    >
      {/* Background glow radiating from the left */}
      <div
        className="absolute top-1/3 left-0 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: activeVariant.hex }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Cockpit Stage */}
          <div 
            onMouseEnter={() => setHovered(true)}
            className="lg:col-span-7 order-2 lg:order-1 cursor-pointer"
          >
            <motion.div 
              className="relative w-full aspect-video rounded-sm overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl"
              animate={{
                boxShadow: hovered ? `0 15px 35px -10px ${activeVariant.hex}20` : "0 4px 20px rgba(0,0,0,0)"
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Scanlines tech grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none z-10" />

              {/* Main Cockpit Image with smooth spring parallax and scale */}
              <motion.img
                style={{ 
                  x: imgX, 
                  y: imgY,
                  scale: hovered ? 1.05 : 1.01
                }}
                transition={{
                  scale: { duration: 0.6 }
                }}
                src="https://static0.hotcarsimages.com/wordpress/wp-content/uploads/2022/08/_AKOS7823_edit_V02_highres-1.jpeg?q=50&fit=crop&w=825&dpr=1.5"
                alt="Porsche 911 GT3 RS interior cabin steering wheel"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.88] z-0 select-none pointer-events-none"
              />

              {/* Light reflection sweep based on mouse position */}
              <motion.div 
                style={{
                  background: useTransform(
                    [springX, springY],
                    ([x, y]) => `radial-gradient(circle 280px at ${50 + x * 90}% ${50 + y * 90}%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 80%)`
                  ),
                }}
                className="absolute inset-0 z-15 pointer-events-none mix-blend-overlay"
              />

              {/* Tactical details overlay */}
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/80 border border-white/10 px-2.5 py-1 rounded-[4px] pointer-events-none select-none">
                <span className="text-[9px] font-mono tracking-widest text-gray-300">CABIN SPEC // CARBON FIBRE</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Title and Context */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 md:space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: activeVariant.hex }}>
                DRIVER FOCUSED
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-display text-white">
                EVERY DETAIL.<br />
                ONE PURPOSE.
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              Inside, the lightweight cabin is focused 100% on performance. Alcantara grip surfaces wrap the steering wheel, framing carbon fiber bucket seats and an intuitive cluster designed to provide instantaneous feedback at 9000 RPM.
            </p>

            <div className="pt-2">
              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  onExploreInteriorClick();
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
                id="cockpit-explore-btn"
              >
                <span>EXPLORE INTERIOR</span>
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

        </div>
      </div>
    </section>
  );
}
