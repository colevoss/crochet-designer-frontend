import { CellMap } from "../cell";
import { BaseGrid } from "../grid";
import { ICanvas } from "../icanvas";
import { IState } from "../istate";
import { ImageCanvas } from "./image-canvas";
import { ImageGrid } from "./image-grid";

export class ImageState implements IState {
  canvas: ICanvas;
  cells: CellMap;
  grid: BaseGrid;
  bg: string;

  constructor(public parentState: IState) {
    this.bg = parentState.bg;
    this.grid = new ImageGrid(parentState.grid.cols, parentState.grid.rows);
    this.cells = parentState.cells;
    this.canvas = new ImageCanvas(this.grid);
  }

  public draw() {
    this.canvas.save();

    this.canvas.ctx.fillStyle = this.bg;
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.restore();

    this.cells.draw(this);
    this.grid.draw(this);
  }
}
