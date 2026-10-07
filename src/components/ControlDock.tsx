import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Shuffle,
  LayoutGrid,
  Expand,
  Sparkles,
} from 'lucide-react';
import { SlideshowSettings } from '../types';

interface ControlDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
  settings: SlideshowSettings;
  onUpdateSettings: (patch: Partial<SlideshowSettings>) => void;
  hasBgm: boolean;
  isBgmActive: boolean;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
  isFullscreen,
  onToggleFullscreen,
  onOpenSettings,
  settings,
  onUpdateSettings,
  hasBgm,
  isBgmActive,
}) => {
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);

  const cycleFitMode = () => {
    if (settings.fitMode === 'contain-glow') {
      onUpdateSettings({ fitMode: 'contain' });
    } else if (settings.fitMode === 'contain') {
      onUpdateSettings({ fitMode: 'cover' });
    } else {
      onUpdateSettings({ fitMode: 'contain-glow' });
    }
  };

  const getFitModeLabel = () => {
    switch (settings.fitMode) {
      case 'contain-glow':
        return '감성 블러';
      case 'contain':
        return '비율 유지';
      case 'cover':
        return '꽉 차게';
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 glass-dock px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white pointer-events-auto">
      {/* Photo Counter */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-300 font-mono tabular-nums pr-2 border-r border-white/15">
        <span className="font-semibold text-white">{currentIndex + 1}</span>
        <span className="text-gray-500">/</span>
        <span>{totalCount}</span>
      </div>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        title="이전 사진 (←)"
        aria-label="이전 사진"
        className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Main Play / Pause Button */}
      <button
        onClick={onTogglePlay}
        title={isPlaying ? '일시정지 (스페이스바)' : '자동 재생 (스페이스바)'}
        aria-label={isPlaying ? '일시정지' : '재생'}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
          isPlaying
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
            : 'bg-white hover:bg-gray-100 text-slate-900 shadow-white/20'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current translate-x-0.5" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        title="다음 사진 (→)"
        aria-label="다음 사진"
        className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* Shuffle Toggle */}
      <button
        onClick={() => onUpdateSettings({ shuffle: !settings.shuffle })}
        title={settings.shuffle ? '순서대로 재생' : '랜덤 셔플 재생'}
        aria-label="셔플 재생 토글"
        className={`p-2 rounded-full transition-all ${
          settings.shuffle
            ? 'text-blue-400 bg-blue-500/20'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Fit Mode Toggle Button */}
      <button
        onClick={cycleFitMode}
        title={`화면 맞춤 방식: ${getFitModeLabel()}`}
        aria-label="화면 맞춤 방식 변경"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/10"
      >
        {settings.fitMode === 'contain-glow' ? (
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <Expand className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span>{getFitModeLabel()}</span>
      </button>

      {/* Filmstrip Drawer Toggle */}
      <button
        onClick={() =>
          onUpdateSettings({ showFilmstrip: !settings.showFilmstrip })
        }
        title="사진 목록 / 필름스트립 열기 (T)"
        aria-label="사진 목록 열기"
        className={`p-2 rounded-full transition-all ${
          settings.showFilmstrip
            ? 'text-blue-400 bg-blue-500/20'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* BGM Volume Popover Trigger */}
      <div className="relative">
        <button
          onClick={() => setShowVolumeMenu(!showVolumeMenu)}
          title="배경 음악 음량 설정"
          aria-label="배경 음악 음량"
          className={`p-2 rounded-full transition-all relative ${
            isBgmActive && !settings.bgmMuted
              ? 'text-blue-400 bg-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {settings.bgmMuted || settings.bgmVolume === 0 ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          )}

          {/* Equalizer animation indicator when playing */}
          {isBgmActive && !settings.bgmMuted && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </button>

        {showVolumeMenu && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 glass-panel p-3.5 rounded-2xl shadow-2xl w-44 flex flex-col gap-2 z-50">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>BGM 볼륨</span>
              <button
                onClick={() =>
                  onUpdateSettings({ bgmMuted: !settings.bgmMuted })
                }
                className="text-xs text-blue-400 hover:underline"
              >
                {settings.bgmMuted ? '음소거 해제' : '음소거'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmMuted ? 0 : settings.bgmVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                onUpdateSettings({ bgmVolume: vol, bgmMuted: false });
              }}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
            />
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* Settings Modal Button */}
      <button
        onClick={onOpenSettings}
        title="슬라이드쇼 설정 (S)"
        aria-label="설정"
        className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:rotate-45 transition-all"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? '전체화면 종료 (F)' : '전체화면 시작 (F)'}
        aria-label="전체화면 전환"
        className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5" />
        ) : (
          <Maximize2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
