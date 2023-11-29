import { Draw } from "../draw";
import { IState } from "../istate";
import { CellDimensions } from "../types";
import { Ruler } from "./ruler";

export abstract class BaseGrid implements Draw {
  public abstract ruler: Ruler;

  public abstract rows: number;
  public abstract cols: number;

  // zoom
  public z: number = 1;

  // scroll x and y
  public offsetX: number = 0;
  public offsetY: number = 0;

  public abstract height: number;
  public abstract width: number;

  public abstract cellWidth: number;
  public abstract cellHeight: number;

  public get realCellWidth(): number {
    return this.cellWidth * this.z;
  }

  public get realCellHeight(): number {
    return this.cellHeight * this.z;
  }

  public get realOffsetY(): number {
    return this.offsetY + this.ruler.height;
  }

  public get realOffsetX(): number {
    return this.offsetX + this.ruler.width;
  }

  public gridHeightAtZoom(z: number): number {
    return z * this.rows * this.cellHeight + this.ruler.height;
  }

  public gridWidthAtZoom(z: number): number {
    return z * this.cols * this.cellWidth + this.ruler.width;
  }

  public zoom(z: number) {
    const newZoom = this.z + z;

    // const gridHeight = this.gridHeightAtZoom(newZoom);
    // const gridWidth = this.gridWidthAtZoom(newZoom);

    // if (gridHeight <= this.height && gridWidth <= this.width) {
    //   return;
    // }

    this.z = newZoom;

    this.offsetX = this.getClampedScrollX(this.offsetX);
    this.offsetY = this.getClampedScrollY(this.offsetY);
  }

  public scroll(x: number, y: number) {
    this.offsetX = this.getClampedScrollX(this.offsetX + x);
    this.offsetY = this.getClampedScrollY(this.offsetY + y);
  }

  protected getClampedScrollX(x: number): number {
    const gridWidth = this.gridWidthAtZoom(this.z);

    if (gridWidth <= this.width) {
      return 0;
    }

    let newX = Math.min(x, 0);
    const minXOffset = Math.floor(this.width - gridWidth);
    newX = Math.max(newX, minXOffset);

    return newX;
  }

  protected getClampedScrollY(y: number): number {
    const gridHeight = this.gridHeightAtZoom(this.z);

    if (gridHeight <= this.height) {
      return 0;
    }

    let newY = Math.min(y, 0);

    const minYOffset = Math.floor(this.height - gridHeight);
    newY = Math.max(newY, minYOffset);

    return newY;
  }

  public draw(state: IState): void {
    state.canvas.save();

    state.canvas.ctx.lineWidth = 0.5;
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

  public clearCell(state: IState, col: number, row: number): void {
    const [x, y, w, h] = this.getCellDimmension(col, row);

    state.canvas.save();

    state.canvas.ctx.fillStyle = state.bg;
    state.canvas.ctx.strokeStyle = "#c4c4c4";

    state.canvas.ctx.fillRect(x, y, w, h);
    state.canvas.ctx.strokeRect(x, y, w, h);

    state.canvas.restore();
  }

  public getIdxAtCoord(x: number, y: number): number {
    const col = Math.floor(
      (x - this.offsetX - this.ruler.width) / (this.cellWidth * this.z),
    );
    const row = Math.floor(
      (y - this.offsetY - this.ruler.height) / (this.cellHeight * this.z),
    );
    const cellIdx = this.cols * row + col;

    return cellIdx;
  }

  public getCellDimmension(col: number, row: number): CellDimensions {
    let x = col * this.cellWidth * this.z + this.offsetX + this.ruler.width;
    let y = row * this.cellHeight * this.z + this.offsetY + this.ruler.height;

    let width = this.realCellWidth;
    let height = this.realCellHeight;

    if (y < this.ruler.height) {
      height -= this.ruler.height - y;
      y = this.ruler.height;
    }

    if (x < this.ruler.width) {
      width -= this.ruler.width - x;
      x = this.ruler.width;
    }

    return [x, y, width, height];
  }

  public isCellVisible(col: number, row: number): boolean {
    const cellWidth = this.realCellWidth;
    const cellHeight = this.realCellHeight;

    const top = row * cellHeight + this.realOffsetY;
    const bottom = top + cellHeight;

    // if (bottom < 0) {
    if (bottom < this.ruler.height) {
      return false;
    }

    if (top > this.height) {
      return false;
    }

    const left = col * cellWidth + this.realOffsetX;
    const right = left + cellWidth;

    if (right < this.ruler.width) {
      return false;
    }

    if (left > this.width) {
      return false;
    }

    return true;
  }
}
