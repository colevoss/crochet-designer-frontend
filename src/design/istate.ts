import { ICanvas } from "./icanvas";
import { CellMap } from "./cell";
import { BaseGrid } from "./grid";

export interface IState {
  canvas: ICanvas;
  cells: CellMap;
  grid: BaseGrid;
  bg: string;
}
