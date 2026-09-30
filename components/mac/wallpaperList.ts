// Kept separate so the menu can list wallpapers without loading them
export type WallpaperVariant = 'splash' | 'bubbles' | 'mesh' | 'dynamic';

// Menu order: the default first, the quietest last
export const WALLPAPERS: { id: WallpaperVariant; label: string }[] = [
  { id: 'splash',  label: 'Splash'  },
  { id: 'bubbles', label: 'Bubbles' },
  { id: 'dynamic', label: 'Dynamic' },
  { id: 'mesh',    label: 'Mesh'    },
];
