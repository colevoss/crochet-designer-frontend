import { BaseGrid } from "../grid";
import { ICanvas } from "../icanvas";

export class ImageCanvas implements ICanvas {
  height: number;
  width: number;

  ctx: CanvasRenderingContext2D;
  element: HTMLCanvasElement;

  constructor(grid: BaseGrid) {
    this.width = grid.width;
    this.height = grid.height;

    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d", { alpha: false })!;

    this.element.width = this.width;
    this.element.height = this.height;
  }

  save(): void {
    this.ctx.save();
  }
  restore(): void {
    this.ctx.restore();
  }
}
