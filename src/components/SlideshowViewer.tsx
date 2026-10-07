import React from 'react';
import { SlidePhoto, SlideshowSettings } from '../types';

interface SlideshowViewerProps {
  currentPhoto: SlidePhoto | null;
  nextPhoto: SlidePhoto | null;
  settings: SlideshowSettings;
  progressPercent: number;
}

export const SlideshowViewer: React.FC<SlideshowViewerProps> = ({
  currentPhoto,
  settings,
  progressPercent,
}) => {
  if (!currentPhoto) return null;

  // Decide zoom/pan animation class based on settings
  const isKenBurns = settings.transition === 'kenburns';
  const objectFitClass =
    settings.fitMode === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center select-none">
      {/* Ambient Blurred Glow Backdrop (for contain-glow mode) */}
      {settings.fitMode === 'contain-glow' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            key={`glow-${currentPhoto.id}`}
            src={currentPhoto.url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-125 blur-3xl opacity-45 brightness-75 transition-opacity duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Main Slide Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt={currentPhoto.name}
          className={`w-full h-full ${objectFitClass} transition-opacity duration-1000 ease-in-out ${
            isKenBurns ? 'animate-kenburns-1' : ''
          }`}
          style={{
            animationDuration: `${settings.interval + 3}s`,
          }}
        />
      </div>

      {/* Subtle Progress Bar along bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 pointer-events-none z-10">
        <div
          className="h-full bg-blue-500/80 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Subtle bottom vignette to ensure control bar contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10" />
    </div>
  );
};
