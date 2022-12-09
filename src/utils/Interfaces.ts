import { Player } from './Types';

export interface RectAreaData {
  x: number;
  y: number;
  occupiedBy?: Player;
  fullColumn?: boolean;
}
