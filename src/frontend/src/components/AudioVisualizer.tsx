import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isPlaying, 
  barCount = 40 
}) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      barsRef.current.forEach(bar => {
        if (bar) bar.style.transform = 'scaleY(0.2)';
      });
      return;
    }

    // Simple animation without anime.js
    const intervals = barsRef.current.map((bar, index) => {
      if (!bar) return null;
      
      return setInterval(() => {
        const randomHeight = Math.random() * 0.8 + 0.2;
        bar.style.transform = `scaleY(${randomHeight})`;
      }, 100 + index * 10);
    });

    return () => {
      intervals.forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-1 h-32 px-4">
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          initial={{ scaleY: 0.2 }}
          className="w-1 h-full rounded-full origin-bottom transition-transform duration-100"
          style={{
            background: `linear-gradient(to top, 
              ${['#8ec07c', '#fabd2f', '#fe8019', '#d3869b', '#b16286'][i % 5]}, 
              transparent)`,
            opacity: isPlaying ? 0.8 : 0.2,
          }}
        />
      ))}
    </div>
  );
};
