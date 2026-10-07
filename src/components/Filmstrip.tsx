import React, { useRef, useEffect } from 'react';
import { SlidePhoto } from '../types';
import { X, Image as ImageIcon } from 'lucide-react';

interface FilmstripProps {
  photos: SlidePhoto[];
  currentIndex: number;
  onSelectPhoto: (index: number) => void;
  onClose: () => void;
}

export const Filmstrip: React.FC<FilmstripProps> = ({
  photos,
  currentIndex,
  onSelectPhoto,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to active thumbnail
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(
      `[data-photo-index="${currentIndex}"]`
    ) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl glass-panel rounded-2xl p-3 shadow-2xl z-30 pointer-events-auto border border-white/15">
      <div className="flex items-center justify-between pb-2 px-1 text-xs text-gray-300 border-b border-white/10 mb-2.5">
        <div className="flex items-center gap-1.5 font-medium">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <span>전체 사진 목록 ({photos.length}장)</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="목록 닫기 (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin scroll-smooth"
      >
        {photos.map((photo, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={photo.id}
              data-photo-index={index}
              onClick={() => onSelectPhoto(index)}
              className={`relative shrink-0 group rounded-xl overflow-hidden transition-all duration-200 ${
                isActive
                  ? 'ring-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/30'
                  : 'opacity-65 hover:opacity-100 hover:scale-102 ring-1 ring-white/10'
              }`}
            >
              <div className="w-20 h-14 sm:w-24 sm:h-16 bg-neutral-900 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                  <span className="text-[10px] text-white truncate max-w-full">
                    {index + 1}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
