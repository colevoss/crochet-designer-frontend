import { Draw } from "../draw";
import { IState } from "../istate";

type Options = {
  size?: number;
};

export class Ruler implements Draw {
  public readonly height: number = 25;
  public readonly width: number = 25;
  public readonly fontSize: number;

  public bg: string = "#e8e8e8";
  public fg: string = "#000";

  constructor({ size = 25 }: Options = {}) {
    this.height = size;
    this.width = size;
    this.fontSize = Math.floor(size / 2.5);
  }

  public draw(state: IState) {
    state.canvas.save();
    state.canvas.ctx.font = `${this.fontSize}px sans-serif`;

    this.drawLeftRuler(state);
    this.drawTopRuler(state);

    state.canvas.restore();
  }

  private drawTopRuler(state: IState) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = this.bg;
    state.canvas.ctx.fillRect(0, 0, state.canvas.width, this.height);
    // Base Y coord for bottom ruler
    const bottomYBase = state.canvas.height - this.height;
    state.canvas.ctx.fillRect(0, bottomYBase, state.canvas.width, this.height);

    state.canvas.ctx.fillStyle = this.fg;

    // caching because they are computed
    const cellWidth = state.grid.realCellWidth;
    const halfCellWidth = cellWidth / 2;
    const halfCellHeight = this.height / 2;
    const offset = state.grid.offsetX + this.width;

    const shouldAlternate = cellWidth < 20;

    for (let i = 1; i <= state.grid.cols; i++) {
      const str = String(i);
      const meas = state.canvas.ctx.measureText(str);
      const textWidth = meas.width;

      const cellOffset = cellWidth - (halfCellWidth - textWidth / 2);
      const coord = i * cellWidth - cellOffset;
      const x = coord + offset;

      // don't render if text is behind left bar or off screen
      if (x - textWidth < this.width) {
        continue;
      }

      const height =
        meas.actualBoundingBoxDescent + meas.actualBoundingBoxAscent;

      const y = halfCellHeight - height / 2 + height; // add height again because fillText y is the baseline

      // If cell is too small, render odds of top and evens on bottom
      // top
      if (!shouldAlternate || i % 2 === 0) {
        state.canvas.ctx.fillText(str, x, y, cellWidth);
      }

      // bottom
      if (!shouldAlternate || i % 2 === 1) {
        const bottomY = bottomYBase + y;
        state.canvas.ctx.fillText(str, x, bottomY, cellWidth);
      }
    }

    state.canvas.restore();
  }

  private drawLeftRuler(state: IState) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = this.bg;
    state.canvas.ctx.fillRect(0, 0, this.width, state.canvas.height);

    // Base X for the right ruler
    const rightXBase = state.canvas.width - this.width;
    state.canvas.ctx.fillRect(rightXBase, 0, this.width, state.canvas.height);

    state.canvas.ctx.fillStyle = this.fg;

    // caching because they are computed
    const cellWidth = state.grid.realCellWidth;
    const cellHeight = state.grid.realCellHeight;
    const halfCellHeight = cellHeight / 2;
    const offset = state.grid.offsetY + this.height;
    const halfCellWidth = this.width / 2;

    const shouldAlternate = cellHeight < 20;

    for (let i = 1; i <= state.grid.rows; i++) {
      const str = String(i);
      const meas = state.canvas.ctx.measureText(str);

      // Y
      const coord = i * cellHeight;

      const height =
        // this gets the full height of rendered text
        meas.actualBoundingBoxDescent + meas.actualBoundingBoxAscent;

      const textYOffset = halfCellHeight - height / 2;

      // coord is the bottom of a cell, so we add the offset to go "up" to the baseline of the text
      const y = coord - textYOffset + offset;

      // don't render if text is behind top bar or off screen
      if (y - height < this.height) {
        continue;
      }

      // X
      const textWidth = meas.width;
      const x = halfCellWidth - textWidth / 2;

      // If cell is too small, render odds of left and evens on right
      // Left
      if (!shouldAlternate || i % 2 === 1) {
        state.canvas.ctx.fillText(str, x, y, cellWidth);
      }

      // right
      if (!shouldAlternate || i % 2 === 0) {
        const rightX = rightXBase + x;
        state.canvas.ctx.fillText(str, rightX, y, cellWidth);
      }
    }

    state.canvas.restore();
  }
}
