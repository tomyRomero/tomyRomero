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
  | { type: 'FOCUS';       id: string }
  | { type: 'MOVE';        id: string; x: number; y: number }
  | { type: 'RESIZE';      id: string; w: number; h: number }
  | { type: 'OPEN_ALL' }
  | { type: 'CLOSE_ALL' }
  | { type: 'MIN_ALL' }
  | { type: 'ARRANGE' }
  | { type: 'OPEN_AT'; id: string; x: number; y: number; w?: number; h?: number };
