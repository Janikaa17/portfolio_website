import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // Smooth cursor movement using Framer Motion
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);

  // Spring animation for smooth movement
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);
  const smoothTrailX = useSpring(trailX, { damping: 30, stiffness: 150 });
  const smoothTrailY = useSpring(trailY, { damping: 30, stiffness: 150 });

  // Scale transform for hover effect
  const scale = useTransform(smoothCursorX, [0, window.innerWidth], [1, 1.2]);
  const trailScale = useTransform(smoothTrailX, [0, window.innerWidth], [0.8, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
          scale: isClicking ? 0.8 : isPointer ? 1.2 : scale,
        }}
      >
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`absolute -inset-2 rounded-full border-2 transition-colors duration-200 ${
              isPointer ? 'border-[#E576CD]' : 'border-[#E576CD]/50'
            }`}
          />
          {/* Inner dot */}
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isPointer ? 'bg-[#E576CD]' : 'bg-[#E576CD]/80'
            }`}
          />
          {/* Glow effect */}
          <div
            className={`absolute -inset-4 rounded-full transition-opacity duration-200 ${
              isPointer ? 'bg-[#E576CD]/20' : 'bg-[#E576CD]/10'
            } blur-md`}
          />
        </div>
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        ref={trailRef}
        className="fixed pointer-events-none z-40"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          scale: trailScale,
        }}
      >
        <div className="relative">
          <div className="absolute -inset-3 rounded-full border border-[#E576CD]/30" />
          <div className="absolute -inset-4 rounded-full bg-[#E576CD]/5 blur-sm" />
        </div>
      </motion.div>
    </>
  );
};

export default CustomCursor; 