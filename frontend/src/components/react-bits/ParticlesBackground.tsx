import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  quantity?: number;
  className?: string;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  quantity = 30,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const circles = useRef<any[]>([]);

  const colors = [
    'rgba(37, 99, 235, 0.65)',  // Royal Blue
    'rgba(16, 185, 129, 0.65)', // Emerald Green
    'rgba(6, 182, 212, 0.65)',  // Electric Cyan
    'rgba(52, 211, 153, 0.65)', // Neon Mint
    'rgba(14, 165, 233, 0.60)', // Sky Blue
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvasSize.current.w = window.innerWidth;
        canvasSize.current.h = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initCircles();
      }
    };

    const initCircles = () => {
      circles.current = [];
      for (let i = 0; i < quantity; i++) {
        circles.current.push({
          x: Math.random() * canvasSize.current.w,
          y: Math.random() * canvasSize.current.h,
          size: Math.random() * 3 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const drawCircles = () => {
      ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

      for (let i = 0; i < circles.current.length; i++) {
        const circle = circles.current[i];

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = circle.color;
        ctx.fill();

        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x < 0) circle.x = canvasSize.current.w;
        if (circle.x > canvasSize.current.w) circle.x = 0;
        if (circle.y < 0) circle.y = canvasSize.current.h;
        if (circle.y > canvasSize.current.h) circle.y = 0;
      }

      animationFrameId = requestAnimationFrame(drawCircles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawCircles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [quantity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 opacity-60 ${className}`}
    />
  );
};
