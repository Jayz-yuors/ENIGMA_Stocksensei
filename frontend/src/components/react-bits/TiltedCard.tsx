import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scaleOnHover?: number;
  glowColor?: string;
  onClick?: () => void;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareOpacity = 0.35,
  scaleOnHover = 1.015,
  glowColor = 'rgba(255, 255, 255, 0.7)',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 22, stiffness: 280 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  const glareX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="inline-block w-full h-full transform-gpu"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-3xl border border-white/80 bg-white/80 backdrop-blur-2xl overflow-hidden transition-all duration-300 shadow-xl shadow-slate-200/50 ${
          isHovered ? 'border-purple-300/80 shadow-2xl shadow-indigo-500/15' : ''
        } ${className}`}
      >
        {/* Luminous Specular Glare */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute -inset-full opacity-0 transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle 400px at ${glareX} ${glareY}, ${glowColor}, transparent 60%)`,
            }}
          />
        )}

        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
