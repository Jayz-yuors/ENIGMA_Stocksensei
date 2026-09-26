import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
  className?: string;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  quantity = 40,
  staticity = 50,
  ease = 50,
  color = '#06B6D4',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const circles = useRef<any[]>([]);

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
          translateX: 0,
          translateY: 0,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.4 + 0.1,
          targetAlpha: Math.random() * 0.4 + 0.1,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          magnetism: 0.1 + Math.random() * 4,
        });
      }
    };

    const drawCircles = () => {
      ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

      for (let i = 0; i < circles.current.length; i++) {
        const circle = circles.current[i];

        // Draw connections
        for (let j = i + 1; j < circles.current.length; j++) {
          const c2 = circles.current[j];
          const dist = Math.hypot(circle.x - c2.x, circle.y - c2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(circle.x, circle.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 100) * 0.08;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = circle.alpha;
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
  }, [quantity, staticity, ease, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 opacity-40 ${className}`}
    />
  );
};
