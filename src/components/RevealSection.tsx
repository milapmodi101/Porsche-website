import { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function RevealSection({ children, id, className }: RevealSectionProps) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 16,
        mass: 1.1,
      }}
    >
      {children}
    </motion.div>
  );
}
