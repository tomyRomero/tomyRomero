export interface Win {
  id: string;
  title: string;
  isOpen: boolean;
  isMin: boolean;
  isMax: boolean;
  pos: { x: number; y: number };
  sz: { w: number; h: number };
  defPos: { x: number; y: number };
  defSz: { w: number; h: number };
  // Smallest size a resize can reach (the app's layout floor)
  minSz?: { w: number; h: number };
  // Set once the window has had its first, centered placement
  placed?: boolean;
  z: number;
  minning: boolean;
  closing: boolean;
}

export type WinAction =
  | { type: 'OPEN';        id: string }
  | { type: 'CLOSE';       id: string }
  | { type: 'CLOSE_START'; id: string }
  | { type: 'MIN_START';   id: string }
  | { type: 'MIN_DONE';    id: string }
  | { type: 'RESTORE';     id: string }
  | { type: 'TOGGLE_MAX';  id: string }
  | { type: 'UNZOOM_AT';   id: string; x: number; y: number }
  | { type: 'FOCUS';       id: string }
  | { type: 'MOVE';        id: string; x: number; y: number }
  | { type: 'RESIZE';      id: string; w: number; h: number }
  | { type: 'OPEN_ALL' }
  | { type: 'CLOSE_ALL' }
  | { type: 'MIN_ALL' }
  | { type: 'ARRANGE' }
  | { type: 'OPEN_AT'; id: string; x: number; y: number; w?: number; h?: number };

// About opens first, centered left of the widgets; DesktopPhotos pins
// prints in the space beside it
export const ABOUT_W = 580;

// Portrait tablets have no room for the widget column, so the widgets run in
// a row across the top and About opens under it
export const isWidgetRow = (vw: number, vh: number) => vw < 1000 && vh >= 880;
export const WIDGET_ROW = { top: 16, bottom: 186 };
