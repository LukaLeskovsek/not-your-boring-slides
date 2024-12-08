import { useEffect, useRef } from 'react';
import type { PieChartData } from '@/types/presentation';

interface PieChartProps {
  data: PieChartData[];
}

export function PieChart({ data }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Draw pie chart
    let startAngle = 0;
    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.arc(200, 200, 150, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = 180;
      const labelX = 200 + Math.cos(labelAngle) * labelRadius;
      const labelY = 200 + Math.sin(labelAngle) * labelRadius;

      ctx.font = '14px Inter';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label} (${Math.round((item.value / total) * 100)}%)`, labelX, labelY);

      startAngle += sliceAngle;
    });
  }, [data]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
}