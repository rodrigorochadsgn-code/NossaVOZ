import React, { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  isLoading: boolean;
  accent?: 'emerald' | 'amber';
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  isLoading,
  accent = 'emerald',
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => Math.random() * 20 + 8)
  );

  useEffect(() => {
    if (!isPlaying && !isLoading) {
      // Idle state
      setBars(Array.from({ length: 32 }, (_, i) => Math.sin(i * 0.3) * 6 + 10));
      return;
    }

    const interval = setInterval(() => {
      setBars(
        Array.from({ length: 32 }, () => {
          if (isLoading) {
            return Math.floor(Math.random() * 45) + 15;
          }
          return Math.floor(Math.random() * 60) + 10;
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isPlaying, isLoading]);

  return (
    <div className="flex items-center justify-center gap-1 h-16 px-4 bg-stone-950/60 rounded-xl border border-stone-800/80 overflow-hidden">
      {bars.map((height, idx) => {
        // Gradient color for bars
        const isHighlight = idx >= 10 && idx <= 22;
        const barColor = isPlaying
          ? isHighlight
            ? 'bg-amber-400'
            : 'bg-emerald-400'
          : isLoading
          ? 'bg-emerald-500/60 animate-pulse'
          : 'bg-stone-700';

        return (
          <div
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-100 ease-out ${barColor}`}
            style={{
              height: `${Math.min(height, 56)}px`,
              opacity: isPlaying ? 0.95 : isLoading ? 0.7 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
};
