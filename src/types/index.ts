export interface SlidePhoto {
  id: string;
  url: string;
  name: string;
  size?: number;
  isSample?: boolean;
  dateAdded: number;
}

export type TransitionEffect = 'kenburns' | 'crossfade' | 'slide' | 'fade-dark';

export type FitMode = 'contain-glow' | 'contain' | 'cover';

export type BuiltInBgm = 'warm_piano' | 'gentle_acoustic' | 'music_box' | 'none';

export interface SlideshowSettings {
  interval: number; // in seconds
  transition: TransitionEffect;
  fitMode: FitMode;
  showCaption: boolean;
  shuffle: boolean;
  showFilmstrip: boolean;
  bgmVolume: number; // 0 to 1
  bgmMuted: boolean;
  selectedPresetBgm: BuiltInBgm;
}
