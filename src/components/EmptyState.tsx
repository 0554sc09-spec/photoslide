import React from 'react';
import { FolderOpen, Sparkles, ImagePlus, Music, Play } from 'lucide-react';

interface EmptyStateProps {
  onSelectFolder: () => void;
  onSelectFiles: () => void;
  onStartWithSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectFolder,
  onSelectFiles,
  onStartWithSamples,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-neutral-950/95 p-6 select-none">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center shadow-2xl max-w-lg text-center border border-white/15 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
          우리반 사진 슬라이드쇼
        </h1>

        <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
          학급 사진 폴더나 추억 사진을 선택하면 감성적인 슬라이드쇼가
          시작됩니다. 잔잔한 배경 음악과 함께 소중한 순간들을 감상해보세요.
        </p>

        <div className="flex flex-col w-full gap-3 sm:gap-3.5">
          <button
            onClick={onSelectFolder}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 text-base active:scale-[0.98]"
          >
            <FolderOpen className="w-5 h-5" />
            <span>사진 폴더 선택하기</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onSelectFiles}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98]"
            >
              <ImagePlus className="w-4 h-4 text-blue-400" />
              <span>사진 파일 선택</span>
            </button>

            <button
              onClick={onStartWithSamples}
              className="py-3 px-4 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-indigo-500/30 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-current" />
              <span>샘플 사진으로 보기</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>부드러운 시네마틱 효과</span>
          </div>
          <span className="text-gray-600">·</span>
          <div className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-blue-400" />
            <span>자체 BGM 지원</span>
          </div>
        </div>
      </div>
    </div>
  );
};
