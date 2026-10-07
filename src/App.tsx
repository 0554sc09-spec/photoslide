/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SlidePhoto, SlideshowSettings, BuiltInBgm } from './types';
import { SAMPLE_PHOTOS } from './data/samplePhotos';
import { SlideshowViewer } from './components/SlideshowViewer';
import { ControlDock } from './components/ControlDock';
import { Filmstrip } from './components/Filmstrip';
import { SettingsModal } from './components/SettingsModal';
import { EmptyState } from './components/EmptyState';
import { TopHeader } from './components/TopHeader';
import { Toast, ToastMessage } from './components/Toast';
import { ambientSynth } from './utils/audioSynthesizer';
import { UploadCloud } from 'lucide-react';

export default function App() {
  // Photos State
  const [photos, setPhotos] = useState<SlidePhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Slideshow Settings
  const [settings, setSettings] = useState<SlideshowSettings>({
    interval: 5,
    transition: 'kenburns',
    fitMode: 'contain-glow',
    showCaption: true,
    shuffle: false,
    showFilmstrip: false,
    bgmVolume: 0.6,
    bgmMuted: false,
    selectedPresetBgm: 'warm_piano',
  });

  // UI States
  const [isUiVisible, setIsUiVisible] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Audio State
  const [customBgmUrl, setCustomBgmUrl] = useState<string | null>(null);
  const [customBgmName, setCustomBgmName] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // References
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Show Toast helper
  const showToast = useCallback((text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ id: Math.random().toString(), text, type });
    window.setTimeout(() => {
      setToast((curr) => (curr?.text === text ? null : curr));
    }, 3200);
  }, []);

  // Track blob urls for memory disposal
  const createTrackedBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.add(url);
    return url;
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current.clear();
      ambientSynth.stop();
    };
  }, []);

  // Idle UI Auto-hide (3 seconds of no mouse/keyboard activity)
  const resetIdleTimer = useCallback(() => {
    setIsUiVisible(true);
    document.body.style.cursor = 'default';

    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    // Do not hide if settings modal is open or no photos loaded
    if (isSettingsOpen || photos.length === 0) return;

    idleTimerRef.current = window.setTimeout(() => {
      setIsUiVisible(false);
      document.body.style.cursor = 'none';
    }, 3200);
  }, [isSettingsOpen, photos.length]);

  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Audio Sync with Settings
  useEffect(() => {
    // Handle volume and mute
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = settings.bgmMuted ? 0 : settings.bgmVolume;
    }
    ambientSynth.setVolume(settings.bgmVolume);
    ambientSynth.setMuted(settings.bgmMuted);
  }, [settings.bgmVolume, settings.bgmMuted]);

  // Handle BGM Play / Stop logic
  const updateBgmPlayback = useCallback(
    (shouldPlay: boolean) => {
      if (!shouldPlay || settings.bgmMuted) {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        ambientSynth.stop();
        setIsAudioPlaying(false);
        return;
      }

      // If user uploaded custom audio
      if (customBgmUrl && audioPlayerRef.current) {
        ambientSynth.stop();
        audioPlayerRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch((err) => {
          console.warn('Custom audio playback blocked:', err);
          setIsAudioPlaying(false);
        });
        return;
      }

      // If built-in preset is chosen
      if (settings.selectedPresetBgm !== 'none') {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        ambientSynth.playPreset(settings.selectedPresetBgm);
        setIsAudioPlaying(true);
        return;
      }

      ambientSynth.stop();
      setIsAudioPlaying(false);
    },
    [customBgmUrl, settings.bgmMuted, settings.selectedPresetBgm]
  );

  // Sync BGM with isPlaying
  useEffect(() => {
    if (photos.length > 0 && isPlaying) {
      updateBgmPlayback(true);
    } else {
      updateBgmPlayback(false);
    }
  }, [isPlaying, photos.length, updateBgmPlayback]);

  // Change slide index handlers
  const goToNextSlide = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => {
      if (settings.shuffle) {
        let next = Math.floor(Math.random() * photos.length);
        if (next === prev && photos.length > 1) {
          next = (next + 1) % photos.length;
        }
        return next;
      }
      return (prev + 1) % photos.length;
    });
    startTimeRef.current = Date.now();
    setProgressPercent(0);
  }, [photos.length, settings.shuffle]);

  const goToPrevSlide = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => {
      if (settings.shuffle) {
        let next = Math.floor(Math.random() * photos.length);
        if (next === prev && photos.length > 1) {
          next = (prev - 1 + photos.length) % photos.length;
        }
        return next;
      }
      return (prev - 1 + photos.length) % photos.length;
    });
    startTimeRef.current = Date.now();
    setProgressPercent(0);
  }, [photos.length, settings.shuffle]);

  // Slideshow Timer & Progress Bar
  useEffect(() => {
    if (!isPlaying || photos.length === 0) {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setProgressPercent(0);
      return;
    }

    startTimeRef.current = Date.now();
    const intervalMs = settings.interval * 1000;

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = (elapsed / intervalMs) * 100;

      if (pct >= 100) {
        goToNextSlide();
      } else {
        setProgressPercent(pct);
      }
    }, 100);

    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isPlaying, photos.length, settings.interval, goToNextSlide]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (photos.length === 0) return;
    setIsPlaying((prev) => {
      const nextState = !prev;
      if (nextState) {
        startTimeRef.current = Date.now();
        showToast('슬라이드쇼 재생 시작', 'info');
      } else {
        showToast('슬라이드쇼 일시정지', 'info');
      }
      return nextState;
    });
    resetIdleTimer();
  }, [photos.length, resetIdleTimer, showToast]);

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        showToast('전체화면 모드 시작 (F 키로 종료)', 'info');
      }).catch((err) => {
        showToast(`전체화면 전환 실패: ${err.message}`, 'error');
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          showToast('전체화면 모드 종료', 'info');
        });
      }
    }
  }, [showToast]);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      resetIdleTimer();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevSlide();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          setSettings((prev) => {
            const nextMuted = !prev.bgmMuted;
            showToast(nextMuted ? '음악 음소거됨' : '음악 소리 켬', 'info');
            return { ...prev, bgmMuted: nextMuted };
          });
          break;
        case 'KeyS':
          e.preventDefault();
          setIsSettingsOpen((prev) => !prev);
          break;
        case 'KeyT':
          e.preventDefault();
          setSettings((prev) => ({ ...prev, showFilmstrip: !prev.showFilmstrip }));
          break;
        case 'Escape':
          if (isSettingsOpen) {
            setIsSettingsOpen(false);
          } else if (settings.showFilmstrip) {
            setSettings((prev) => ({ ...prev, showFilmstrip: false }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToNextSlide,
    goToPrevSlide,
    isSettingsOpen,
    resetIdleTimer,
    settings.showFilmstrip,
    showToast,
    toggleFullscreen,
    togglePlay,
  ]);

  // Handle files selection
  const processImageFiles = useCallback(
    (files: File[], isAppend: boolean = false) => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/avif',
      ];
      const validFiles = files.filter(
        (f) => validTypes.includes(f.type) || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name)
      );

      if (validFiles.length === 0) {
        showToast('선택한 항목에 이미지 파일이 없습니다.', 'error');
        return;
      }

      // Sort alphabetically by name
      validFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      const newPhotos: SlidePhoto[] = validFiles.map((file, idx) => ({
        id: `local-${Date.now()}-${idx}-${file.name}`,
        url: createTrackedBlobUrl(file),
        name: file.name,
        size: file.size,
        dateAdded: Date.now(),
      }));

      if (isAppend) {
        setPhotos((prev) => [...prev, ...newPhotos]);
        showToast(`${newPhotos.length}장의 사진이 추가되었습니다. (총 ${photos.length + newPhotos.length}장)`, 'success');
      } else {
        // Clear previous blob URLs if replacing
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();
        newPhotos.forEach((p) => blobUrlsRef.current.add(p.url));

        setPhotos(newPhotos);
        setCurrentIndex(0);
        setIsPlaying(true);
        showToast(`${newPhotos.length}장의 사진을 불러와 슬라이드쇼를 시작합니다.`, 'success');
      }
    },
    [createTrackedBlobUrl, photos.length, showToast]
  );

  // File Inputs Event Handlers
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(Array.from(e.target.files), false);
    }
    e.target.value = '';
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const isAppend = photos.length > 0;
      processImageFiles(Array.from(e.target.files), isAppend);
    }
    e.target.value = '';
  };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name)) {
      showToast('오디오 파일만 선택할 수 있습니다 (.mp3, .wav 등)', 'error');
      return;
    }

    if (customBgmUrl) {
      URL.revokeObjectURL(customBgmUrl);
    }

    const audioUrl = URL.createObjectURL(file);
    setCustomBgmUrl(audioUrl);
    setCustomBgmName(file.name);
    setSettings((prev) => ({ ...prev, selectedPresetBgm: 'none', bgmMuted: false }));

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.load();
      if (isPlaying) {
        audioPlayerRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }

    showToast(`배경 음악 "${file.name}"이 적용되었습니다.`, 'success');
    e.target.value = '';
  };

  const clearCustomBgm = () => {
    if (customBgmUrl) {
      URL.revokeObjectURL(customBgmUrl);
      setCustomBgmUrl(null);
    }
    setCustomBgmName(null);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
    setSettings((prev) => ({ ...prev, selectedPresetBgm: 'warm_piano' }));
    showToast('기본 배경음악 테마로 복원되었습니다.', 'info');
  };

  // Start with built-in sample photos
  const handleStartWithSamples = () => {
    setPhotos(SAMPLE_PHOTOS);
    setCurrentIndex(0);
    setIsPlaying(true);
    showToast('우리반 추억 샘플 사진으로 슬라이드쇼를 시작합니다!', 'success');
  };

  // Drag and Drop Handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
    } else if (e.dataTransfer.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }

    if (files.length > 0) {
      processImageFiles(files, photos.length > 0);
    }
  };

  const currentPhoto = photos.length > 0 ? photos[currentIndex] : null;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none text-white font-sans"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        // @ts-expect-error webkitdirectory is standard for folder picking in Chromium / Safari
        webkitdirectory=""
        directory=""
        multiple
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={bgmInputRef}
        onChange={handleBgmChange}
        accept="audio/*"
        className="hidden"
      />

      {/* Hidden Native Audio Element for custom BGM */}
      <audio
        ref={audioPlayerRef}
        loop
        className="hidden"
        onEnded={() => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.currentTime = 0;
            audioPlayerRef.current.play();
          }
        }}
      />

      {/* Empty State / Welcome Screen if no photos loaded */}
      {photos.length === 0 && (
        <EmptyState
          onSelectFolder={() => folderInputRef.current?.click()}
          onSelectFiles={() => fileInputRef.current?.click()}
          onStartWithSamples={handleStartWithSamples}
        />
      )}

      {/* Slideshow Display Layer */}
      {photos.length > 0 && (
        <SlideshowViewer
          currentPhoto={currentPhoto}
          nextPhoto={
            photos.length > 1
              ? photos[(currentIndex + 1) % photos.length]
              : null
          }
          settings={settings}
          progressPercent={progressPercent}
        />
      )}

      {/* Floating UI Layer (Auto-hides on idle) */}
      {photos.length > 0 && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-30 ${
            isUiVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar Header */}
          <TopHeader
            currentPhoto={currentPhoto}
            currentIndex={currentIndex}
            totalCount={photos.length}
            showCaption={settings.showCaption}
            onOpenFolderPicker={() => folderInputRef.current?.click()}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Filmstrip / Thumbnail Drawer (if open) */}
          {settings.showFilmstrip && (
            <Filmstrip
              photos={photos}
              currentIndex={currentIndex}
              onSelectPhoto={(idx) => {
                setCurrentIndex(idx);
                startTimeRef.current = Date.now();
                setProgressPercent(0);
              }}
              onClose={() =>
                setSettings((prev) => ({ ...prev, showFilmstrip: false }))
              }
            />
          )}

          {/* Bottom Controls Dock */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
            <ControlDock
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onPrev={goToPrevSlide}
              onNext={goToNextSlide}
              currentIndex={currentIndex}
              totalCount={photos.length}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onOpenSettings={() => setIsSettingsOpen(true)}
              settings={settings}
              onUpdateSettings={(patch) =>
                setSettings((prev) => ({ ...prev, ...patch }))
              }
              hasBgm={!!customBgmUrl || settings.selectedPresetBgm !== 'none'}
              isBgmActive={isAudioPlaying}
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-blue-950/85 backdrop-blur-md flex flex-col items-center justify-center p-8 border-4 border-dashed border-blue-400 pointer-events-none animate-in fade-in duration-200">
          <UploadCloud className="w-20 h-20 text-blue-300 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">
            사진 파일을 여기에 놓으세요!
          </h2>
          <p className="text-blue-200 text-sm">
            폴더 또는 선택한 이미지 파일들이 슬라이드쇼에 즉시 추가됩니다.
          </p>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(patch) =>
          setSettings((prev) => ({ ...prev, ...patch }))
        }
        totalPhotos={photos.length}
        onOpenFolderPicker={() => folderInputRef.current?.click()}
        onOpenFilePicker={() => fileInputRef.current?.click()}
        onOpenBgmPicker={() => bgmInputRef.current?.click()}
        customBgmName={customBgmName}
        onClearCustomBgm={clearCustomBgm}
        onResetToSamplePhotos={handleStartWithSamples}
      />

      {/* Notification Toast */}
      <Toast toast={toast} />
    </div>
  );
}
