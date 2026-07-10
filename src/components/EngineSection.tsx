import { useState, useRef } from "react";
import { Gauge, Activity, Zap, Disc, ArrowRight, X, Info } from "lucide-react";
import { motion, AnimatePresence, useSpring } from "motion/react";
import { CarVariant } from "../types";
import { ENGINE_HIGHLIGHTS } from "../data";
import { audioSynth } from "../utils/audioSynth";

interface EngineSectionProps {
  activeVariant: CarVariant;
}

export default function EngineSection({ activeVariant }: EngineSectionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  // Mouse Parallax coordinates for Engine Visual
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Icon mapping
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "engine-01":
        return <Gauge className={`w-5 h-5 ${colorClass} transition-transform duration-300 group-hover:rotate-12`} />;
      case "engine-02":
        return <Activity className={`w-5 h-5 ${colorClass} transition-transform duration-300 group-hover:scale-110`} />;
      case "engine-03":
        return <Zap className={`w-5 h-5 ${colorClass} transition-transform duration-300 group-hover:scale-110`} />;
      case "engine-04":
        return <Disc className={`w-5 h-5 ${colorClass} transition-transform duration-300 group-hover:rotate-45`} />;
      default:
        return <Info className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <section
      id="technology"
      className="relative bg-black text-white py-20 md:py-32 border-b border-white/10 overflow-hidden"
    >
      {/* Background glow radiating from engine */}
      <div
        className="absolute top-1/2 right-0 w-80 md:w-[600px] h-80 md:h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ backgroundColor: activeVariant.hex }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Specs, descriptions, bullet highlights */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: activeVariant.hex }}>
                ENGINEERING EXCELLENCE
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-display text-white">
                NATURALLY ASPIRATED.<br />
                RARE. RELENTLESS.
              </h2>
            </div>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
              The heart of the 911 GT3 RS is a 4.0-liter naturally aspirated flat-six engine. Designed for maximum response and emotion, it breathes freely all the way to a legendary 9,000 RPM redline without any lag.
            </p>

            {/* Bullet Highlights 2x2 Grid with Hover Lift, Borders, and Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 items-start">
              {ENGINE_HIGHLIGHTS.map((item) => {
                const isHovered = hoveredHighlight === item.id;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5, scale: 1.01 }}
                    animate={{
                      borderColor: isHovered ? `${activeVariant.hex}40` : "rgba(255, 255, 255, 0.05)",
                      boxShadow: isHovered ? `0 10px 25px -10px ${activeVariant.hex}15` : "0 4px 10px rgba(0,0,0,0)",
                      backgroundColor: isHovered ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.015)"
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className="flex items-start space-x-3.5 p-4 rounded-sm border border-solid transition-colors duration-300 group cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredHighlight(item.id);
                      audioSynth.playClick();
                    }}
                    onMouseLeave={() => setHoveredHighlight(null)}
                  >
                    <div className="p-2.5 rounded-sm bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                      {getIcon(item.id, isHovered ? activeVariant.accentClass : "text-gray-400")}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">
                        {item.value}
                      </h4>
                      <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-0.5">
                        {item.label}
                      </p>
                      
                      {/* Interactive description height transition */}
                      <div className="overflow-hidden mt-1.5 max-w-xs">
                        <p className="text-xs text-gray-400 leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 ease-in-out">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* View Engine Details Button */}
            <div className="pt-2">
              <motion.button
                onClick={() => {
                  audioSynth.playClick();
                  setIsDetailsOpen(true);
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
                id="engine-details-btn"
              >
                <span>VIEW ENGINE DETAILS</span>
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

          {/* Right Column: Engine visual with Parallax, Float, and Light Sweep */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 relative flex justify-center cursor-pointer"
          >
            <motion.div 
              style={{
                x: mousePos.x * -25,
                y: mousePos.y * -25,
              }}
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative w-full max-w-lg aspect-[4/3] rounded-sm overflow-hidden border border-white/10 bg-[#070707] shadow-2xl"
            >
              {/* Scanlines overlay for tech feel */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />
              
              {/* Dynamic corner markings */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20" />

              {/* HUD circle elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 m-auto w-64 h-64 border border-dashed border-white/5 rounded-full flex items-center justify-center z-10 pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 m-auto w-48 h-48 border border-dotted border-white/10 rounded-full z-10 pointer-events-none"
              />

              {/* Engine image itself with scale spring */}
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                src="https://res.cloudinary.com/dqqxjay44/image/upload/v1782735287/ChatGPT_Image_Jun_29_2026_05_44_05_PM-Photoroom_ohraqy.png"
                alt="Porsche Boxer Engine"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-6 filter contrast-110 brightness-100 z-10 relative"
              />

              {/* Dynamic light reflections/sweeps following the cursor inside engine container */}
              <motion.div 
                style={{
                  background: `radial-gradient(circle 240px at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 80%)`
                }}
                className="absolute inset-0 pointer-events-none z-15 mix-blend-overlay"
              />

              {/* Glowing engine status pill */}
              <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 bg-black/90 border border-white/10 px-3 py-1.5 rounded-sm shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-gray-300">RPM LIMIT: 9000</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Interactive Engine Details Modal Overlay */}
      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-3 text-white bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                aria-label="Close tech details"
                id="engine-details-close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-gray-500">TECHNICAL DEEP DIVE</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mt-1">4.0L FLAT-SIX MECHANICAL SPECIFICATIONS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm border-t border-white/10 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">ENGINE TYPE</span>
                      <span className="text-white font-bold">NATURALLY ASPIRATED BOXER</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">CYLINDERS</span>
                      <span className="text-white font-bold">6 CYLINDERS (FLAT-6)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">DISPLACEMENT</span>
                      <span className="text-white font-bold">3,996 CC (4.0 LITER)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">VALVES PER CYLINDER</span>
                      <span className="text-white font-bold">4 VALVES / RIGID DRIVE</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">MAXIMUM POWER</span>
                      <span className="text-white font-bold">518 HP @ 8,500 RPM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">MAXIMUM TORQUE</span>
                      <span className="text-white font-bold">346 LB-FT @ 6,300 RPM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">COMPRESSION RATIO</span>
                      <span className="text-white font-bold">13.3 : 1</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">BORE & STROKE</span>
                      <span className="text-white font-bold">102.0 MM x 81.5 MM</span>
                    </div>
                  </div>
                </div>

                {/* Torque Spec Illustration */}
                <div className="bg-[#111] p-4 border border-white/5 rounded-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">DYNO PERFORMANCE OVERVIEW</h4>
                  <div className="h-28 flex items-end justify-between space-x-1.5 pt-4">
                    {/* Mock torque bars */}
                    {[10, 15, 22, 35, 55, 75, 90, 100, 95, 80, 50, 20].map((h, i) => (
                      <div key={i} className="flex-grow flex flex-col items-center">
                        <div
                          className="w-full rounded-t-sm transition-all duration-1000"
                          style={{
                            height: `${h}px`,
                            backgroundColor: i === 7 ? activeVariant.hex : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                        <span className="text-[8px] text-gray-500 font-mono mt-2">{(i + 1) * 1000}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-3">
                    <span>RPM STAGE RANGE</span>
                    <span style={{ color: activeVariant.hex }}>PEAK POWER STAGE: 8,500 RPM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
