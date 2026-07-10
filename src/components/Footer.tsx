import React from "react";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";
import { motion } from "motion/react";
import { CarVariant } from "../types";
import { audioSynth } from "../utils/audioSynth";

interface FooterProps {
  activeVariant: CarVariant;
}

export default function Footer({ activeVariant }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Navigation link sections
  const sections = [
    {
      title: "VEHICLE",
      links: [
        { label: "Overview", href: "#overview" },
        { label: "Performance", href: "#performance" },
        { label: "Design", href: "#design" },
        { label: "Specifications", href: "#subscribe" },
      ],
    },
    {
      title: "TECHNOLOGY",
      links: [
        { label: "Engine Block", href: "#technology" },
        { label: "Chassis Control", href: "#technology" },
        { label: "Aerodynamics", href: "#performance" },
        { label: "Safety Systems", href: "#technology" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "Porsche AG", href: "https://www.porsche.com" },
        { label: "Motorsport", href: "https://www.porsche.com" },
        { label: "Sustainability", href: "https://www.porsche.com" },
        { label: "Careers", href: "https://www.porsche.com" },
      ],
    },
    {
      title: "OWNERSHIP",
      links: [
        { label: "Porsche Experience", href: "https://www.porsche.com" },
        { label: "Service & Warranty", href: "https://www.porsche.com" },
        { label: "Configurator", href: "https://www.porsche.com" },
        { label: "FAQ Support", href: "https://www.porsche.com" },
      ],
    },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    audioSynth.playClick();
  };

  return (
    <footer className="bg-black text-gray-500 py-16 border-t border-white/10 text-xs font-sans relative overflow-hidden">
      {/* Subtle Background Lighting Glow */}
      <div 
        className="absolute bottom-[-150px] right-[10%] w-[350px] h-[350px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none"
        style={{ backgroundColor: activeVariant.hex }}
      />
      <div 
        className="absolute top-0 left-1/4 w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${activeVariant.hex}30, transparent)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
        
        {/* Main Grid: Logo + 4 columns of links + Social icons */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand Identifier */}
          <div className="col-span-2 md:col-span-6 lg:col-span-3 space-y-4">
            <a
              href="#overview"
              onClick={(e) => handleLinkClick(e, "#overview")}
              className="flex items-center group cursor-pointer w-fit"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                src="https://res.cloudinary.com/dqqxjay44/image/upload/v1782739743/ChatGPT_Image_Jun_29_2026_06_55_48_PM-Photoroom_n9hr55.png"
                alt="Porsche Logo"
                referrerPolicy="no-referrer"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
            <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs">
              Motorsport technology adapted for the road. Hand-built with precision engineering in Stuttgart, Germany.
            </p>
          </div>

          {/* Columns 2-5: Nav groups */}
          {sections.map((section) => (
            <div key={section.title} className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3 font-semibold">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 inline-block"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      whileHover={{ x: 6, color: "#ffffff" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 6: Social links */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col items-start lg:items-end space-y-4">
            <h4 className="text-[10px] font-mono font-bold tracking-widest text-white uppercase lg:text-right w-full">
              FOLLOW US
            </h4>
            <div className="flex space-x-3.5 pt-1">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Instagram"
                whileHover={{ scale: 1.18, rotate: 10, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="YouTube"
                whileHover={{ scale: 1.18, rotate: -5, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Youtube className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Twitter X"
                whileHover={{ scale: 1.18, rotate: 10, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Facebook"
                whileHover={{ scale: 1.18, rotate: -10, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Facebook className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclosures */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
          <div>
            <p>© {currentYear} Dr. Ing. h.c. F. Porsche AG. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://www.porsche.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="https://www.porsche.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Terms of Use
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
