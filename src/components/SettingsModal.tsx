import React, { useRef } from 'react';
import {
  X,
  FolderOpen,
  Upload,
  Music,
  Clock,
  Sparkles,
  Volume2,
  Tv,
  HelpCircle,
  FileImage,
  RotateCcw,
} from 'lucide-react';
import { SlideshowSettings, TransitionEffect, FitMode, BuiltInBgm } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SlideshowSettings;
  onUpdateSettings: (patch: Partial<SlideshowSettings>) => void;
  totalPhotos: number;
  onOpenFolderPicker: () => void;
  onOpenFilePicker: () => void;
  onOpenBgmPicker: () => void;
  customBgmName: string | null;
  onClearCustomBgm: () => void;
  onResetToSamplePhotos: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  totalPhotos,
  onOpenFolderPicker,
  onOpenFilePicker,
  onOpenBgmPicker,
  customBgmName,
  onClearCustomBgm,
  onResetToSamplePhotos,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/15 max-h-[90vh] overflow-y-auto text-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">슬라이드쇼 설정</h2>
              <p className="text-xs text-gray-400">사진 전환 및 배경음악 환경설정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="설정 닫기"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Section 1: Photo Folder & Management */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <FileImage className="w-4 h-4 text-blue-400" />
                사진 보관함 ({totalPhotos}장)
              </label>
              <button
                onClick={onResetToSamplePhotos}
                className="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                title="기본 샘플 사진으로 되돌리기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>샘플 사진 복원</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenFolderPicker}
                className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-200 text-xs font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>사진 폴더 선택</span>
              </button>
              <button
                onClick={onOpenFilePicker}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Upload className="w-4 h-4 text-gray-300" />
                <span>사진 파일 추가</span>
              </button>
            </div>
          </div>

          {/* Section 2: Slide Interval */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                슬라이드 전환 간격
              </label>
              <span className="font-mono text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-xs">
                {settings.interval}초
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={settings.interval}
              onChange={(e) =>
                onUpdateSettings({ interval: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-gray-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>빠름 (1초)</span>
              <span>보통 (5초)</span>
              <span>여유 (20초)</span>
            </div>
          </div>

          {/* Section 3: Transition Effect */}
          <div>
            <label className="block text-gray-300 font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              전환 애니메이션 효과
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'kenburns', label: '켄 번스 (시네마틱 줌)' },
                { id: 'crossfade', label: '부드러운 페이드' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdateSettings({ transition: item.id as TransitionEffect })
                  }
                  className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                    settings.transition === item.id
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Fit Mode */}
          <div>
            <label className="block text-gray-300 font-medium mb-2 flex items-center gap-2">
              <Tv className="w-4 h-4 text-blue-400" />
              화면 맞춤 방식
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'contain-glow', label: '감성 블러 배경' },
                { id: 'contain', label: '비율 유지' },
                { id: 'cover', label: '화면 꽉 차게' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdateSettings({ fitMode: item.id as FitMode })
                  }
                  className={`py-2 px-2.5 text-xs rounded-xl border font-medium text-center transition-all ${
                    settings.fitMode === item.id
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: BGM Selection */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <Music className="w-4 h-4 text-blue-400" />
                배경 음악 (BGM)
              </label>
              {customBgmName && (
                <button
                  onClick={onClearCustomBgm}
                  className="text-xs text-red-400 hover:underline"
                >
                  사용자 음악 해제
                </button>
              )}
            </div>

            {/* Custom File Upload */}
            <button
              onClick={onOpenBgmPicker}
              className="w-full mb-3 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-gray-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span className="truncate max-w-[280px]">
                {customBgmName ? `재생 중: ${customBgmName}` : '내 컴퓨터 음악 파일 선택 (.mp3, .wav 등)'}
              </span>
            </button>

            {/* Built-in Presets */}
            <p className="text-xs text-gray-400 mb-2">또는 내장 감성 BGM 테마 선택:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'warm_piano', label: '햇살 교실 피아노' },
                { id: 'gentle_acoustic', label: '잔잔한 어쿠스틱' },
                { id: 'music_box', label: '추억의 오르골' },
                { id: 'none', label: '음악 끄기' },
              ].map((bgm) => {
                const isSelected =
                  !customBgmName && settings.selectedPresetBgm === bgm.id;
                return (
                  <button
                    key={bgm.id}
                    onClick={() => {
                      if (customBgmName) onClearCustomBgm();
                      onUpdateSettings({
                        selectedPresetBgm: bgm.id as BuiltInBgm,
                      });
                    }}
                    className={`py-2 px-3 text-xs rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-200 border-blue-500/50 font-semibold'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{bgm.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                  </button>
                );
              })}
            </div>

            {/* BGM Volume */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgmMuted ? 0 : settings.bgmVolume}
                onChange={(e) =>
                  onUpdateSettings({
                    bgmVolume: parseFloat(e.target.value),
                    bgmMuted: false,
                  })
                }
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-400 w-8 text-right font-mono">
                {Math.round((settings.bgmMuted ? 0 : settings.bgmVolume) * 100)}%
              </span>
            </div>
          </div>

          {/* Section 6: Additional Display Options */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-xs text-gray-300">화면 상단에 사진 제목 & 순서 표시</span>
              <input
                type="checkbox"
                checked={settings.showCaption}
                onChange={(e) =>
                  onUpdateSettings({ showCaption: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-xs text-gray-300">무작위 순서로 사진 셔플 재생</span>
              <input
                type="checkbox"
                checked={settings.shuffle}
                onChange={(e) =>
                  onUpdateSettings({ shuffle: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>키보드 단축키</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gray-400">
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">Space</span> 재생 / 일시정지</div>
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">← / →</span> 이전 / 다음 사진</div>
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">F</span> 전체화면 토글</div>
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">T</span> 사진 목록 열기</div>
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">M</span> 음악 음소거</div>
              <div><span className="text-gray-200 font-mono bg-white/10 px-1.5 py-0.5 rounded">Esc / S</span> 설정 닫기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
