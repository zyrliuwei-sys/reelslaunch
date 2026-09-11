import { useEffect, useRef } from 'react';

type CanvasRevealEffectProps = {
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  opacities?: number[];
  dotSize?: number;
};

export function CanvasRevealEffect({
  animationSpeed = 5,
  containerClassName = '',
  colors = [[59, 130, 246], [139, 92, 246]],
  opacities = [0.2, 0.35, 0.5, 0.8],
  dotSize = 2,
}: CanvasRevealEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let animationFrame = 0;
    const dots = Array.from({ length: 180 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.9,
      color: colors[index % colors.length],
      opacity: opacities[index % opacities.length],
    }));

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = bounds.width * ratio;
      canvas.height = bounds.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      frame += 0.01 * animationSpeed;

      dots.forEach((dot) => {
        const pulse = (Math.sin(frame * dot.speed + dot.phase) + 1) / 2;
        const radius = dotSize * (0.65 + pulse * 0.7);
        const alpha = dot.opacity * (0.35 + pulse * 0.65);
        const [red, green, blue] = dot.color;
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.beginPath();
        context.arc(dot.x * width, dot.y * height, radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [animationSpeed, colors, dotSize, opacities]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${containerClassName}`}
    />
  );
}
