import React from 'react';
import { SlidePhoto } from '../types';
import { Sparkles, FolderPlus } from 'lucide-react';

interface TopHeaderProps {
  currentPhoto: SlidePhoto | null;
  currentIndex: number;
  totalCount: number;
  showCaption: boolean;
  onOpenFolderPicker: () => void;
  onOpenSettings: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPhoto,
  currentIndex,
  totalCount,
  showCaption,
  onOpenFolderPicker,
  onOpenSettings,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 pointer-events-auto select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-md">
          우리반 사진 슬라이드쇼
        </span>
      </div>

      {/* Zone 2: Photo Title & Index (if enabled) */}
      {showCaption && currentPhoto && (
        <div className="hidden md:flex items-center gap-2 max-w-lg glass-panel px-4 py-1.5 rounded-full text-xs text-gray-200 border border-white/10 shadow-lg truncate">
          <span className="text-blue-400 font-mono font-semibold">
            {currentIndex + 1}/{totalCount}
          </span>
          <span className="text-gray-500">·</span>
          <span className="truncate max-w-xs">{currentPhoto.name}</span>
        </div>
      )}

      {/* Zone 3: Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenFolderPicker}
          title="새 사진 폴더 열기"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition-all backdrop-blur-md"
        >
          <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
          <span>폴더 변경</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-md shadow-blue-600/30 whitespace-nowrap"
        >
          환경설정
        </button>
      </div>
    </header>
  );
};
