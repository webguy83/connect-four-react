import { Player } from './Types';

interface OccupiedBy {
  player: Player;
  index: number;
}

export interface RectAreaData {
  x: number;
  y: number;
  occupiedBy?: OccupiedBy;
  fullColumn?: boolean;
  winningArea?: boolean;
}

export interface Coords {
  x: number;
  y: number;
}
