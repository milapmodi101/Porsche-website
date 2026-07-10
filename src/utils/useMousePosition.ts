import { useState, useEffect } from "react";

export interface MousePosition {
  x: number;
  y: number;
  xNormal: number;
  yNormal: number;
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    xNormal: 0,
    yNormal: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const xNormal = (clientX / window.innerWidth) - 0.5;
      const yNormal = (clientY / window.innerHeight) - 0.5;
      
      setMousePosition({
        x: clientX,
        y: clientY,
        xNormal,
        yNormal,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}
