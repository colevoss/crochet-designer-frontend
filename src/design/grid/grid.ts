import { Draw } from "../draw";
import { State, Options } from "../state";
import { CellDimensions } from "../types";
import { Ruler } from "./ruler";

export class Grid implements Draw {
  ruler: Ruler;
  #zoom: number = 1;

  public height: number;
  public width: number;

  public readonly cols: number;
  public readonly rows: number;

  public readonly cellWidth: number;
  public readonly cellHeight: number;

  public offsetX: number = 0;
  public offsetY: number = 0;

  constructor(state: State, { cols, rows, size = 1 }: Options) {
    this.width = state.canvas.width;
    this.height = state.canvas.height;

    this.ruler = new Ruler();

    this.cols = cols;
    this.rows = rows;

    this.cellWidth = (this.width - this.ruler.width) / this.cols;
    this.cellHeight = this.cellWidth / size;
  }

  refresh(state: State) {
    this.width = state.canvas.width;
    this.height = state.canvas.height;
  }

  // TODO: figure what perfect zoom is for showing all of grid
  public zoom(z: number) {
    const newZoom = this.#zoom + z;

    // const gridHeight = this.gridHeightAtZoom(newZoom);
    // const gridWidth = this.gridWidthAtZoom(newZoom);

    // if (gridHeight <= this.height && gridWidth <= this.width) {
    //   return;
    // }

    this.#zoom = newZoom;

    this.offsetX = this.getClampedScrollX(this.offsetX);
    this.offsetY = this.getClampedScrollY(this.offsetY);
  }

  public gridHeightAtZoom(z: number): number {
    return z * this.rows * this.cellHeight + this.ruler.height;
  }

  public gridWidthAtZoom(z: number): number {
    return z * this.cols * this.cellWidth + this.ruler.width;
  }

  private getClampedScrollX(x: number): number {
    const gridWidth = this.gridWidthAtZoom(this.#zoom);

    if (gridWidth <= this.width) {
      return 0;
    }

    let newX = Math.min(x, 0);
    const minXOffset = Math.floor(this.width - gridWidth);
    newX = Math.max(newX, minXOffset);

    return newX;
  }

  private getClampedScrollY(y: number): number {
    const gridHeight = this.gridHeightAtZoom(this.#zoom);

    if (gridHeight <= this.height) {
      return 0;
    }

    let newY = Math.min(y, 0);

    const minYOffset = Math.floor(this.height - gridHeight);
    newY = Math.max(newY, minYOffset);

    return newY;
  }

  public scroll(x: number, y: number) {
    this.offsetX = this.getClampedScrollX(this.offsetX + x);
    this.offsetY = this.getClampedScrollY(this.offsetY + y);
  }

  public drawTopBar(state: State) {
    state.canvas.save();
  }

  public get realCellWidth(): number {
    return this.cellWidth * this.#zoom;
  }

  public get realCellHeight(): number {
    return this.cellHeight * this.#zoom;
  }

  public get realOffsetY(): number {
    return this.offsetY + this.ruler.height;
  }

  public get realOffsetX(): number {
    return this.offsetX + this.ruler.width;
  }

  public draw(state: State): void {
    state.canvas.save();

    state.canvas.ctx.lineWidth = 1;
    state.canvas.ctx.strokeStyle = "#c4c4c4";

    const widthMult = this.realCellWidth;
    const heightMult = this.realCellHeight;

    const right = this.cols * widthMult;
    const bottom = this.rows * heightMult + this.ruler.height;

    const offsetX = this.realOffsetX;
    const offsetY = this.realOffsetY;

    for (let i = 0; i < this.cols; i++) {
      const coord = (i + 1) * widthMult;
      const x = coord + offsetX;
      state.canvas.ctx.beginPath();

      state.canvas.ctx.moveTo(x, this.ruler.height);
      state.canvas.ctx.lineTo(x, bottom);
      state.canvas.ctx.stroke();
    }

    for (let i = 0; i < this.rows; i++) {
      const coord = (i + 1) * heightMult;
      const y = coord + offsetY;
      state.canvas.ctx.beginPath();

      state.canvas.ctx.moveTo(this.ruler.width, y);
      state.canvas.ctx.lineTo(right + this.ruler.width, y);
      state.canvas.ctx.stroke();
    }

    state.canvas.restore();

    this.ruler.draw(state);
  }

  public clearCell(state: State, col: number, row: number): void {
    const [x, y, w, h] = this.getCellDimmension(col, row);

    state.canvas.save();

    state.canvas.ctx.fillStyle = state.backgroundColor;
    state.canvas.ctx.strokeStyle = "#c4c4c4";

    state.canvas.ctx.fillRect(x, y, w, h);
    state.canvas.ctx.strokeRect(x, y, w, h);

    state.canvas.restore();
  }

  public getIdxAtCoord(x: number, y: number): number {
    const col = Math.floor(
      (x - this.offsetX - this.ruler.width) / (this.cellWidth * this.#zoom),
    );
    const row = Math.floor(
      (y - this.offsetY - this.ruler.height) / (this.cellHeight * this.#zoom),
    );
    const cellIdx = this.cols * row + col;

    return cellIdx;
  }

  public getCellDimmension(col: number, row: number): CellDimensions {
    const x =
      col * this.cellWidth * this.#zoom + this.offsetX + this.ruler.width;
    const y =
      row * this.cellHeight * this.#zoom + this.offsetY + this.ruler.height;

    const width = this.realCellWidth;
    const height = this.realCellHeight;

    return [x, y, width, height];
  }

  public isCellVisible(col: number, row: number): boolean {
    const cellWidth = this.realCellWidth;
    const cellHeight = this.realCellHeight;

    const top = row * cellHeight + this.realOffsetY;
    const bottom = top + cellHeight;

    if (bottom < 0) {
      return false;
    }

    if (top > this.height) {
      return false;
    }

    const left = col * cellWidth + this.realOffsetX;
    const right = left + cellWidth;

    if (right < 0) {
      return false;
    }

    if (left > this.width) {
      return false;
    }

    return true;
  }

  public urlData() {
    return {
      w: this.cols,
      h: this.rows,
    };
  }
}
