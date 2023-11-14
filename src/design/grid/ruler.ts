import { Draw } from "../draw";
import { State } from "../state";

export class Ruler implements Draw {
  public readonly height: number = 25;
  public readonly width: number = 25;

  public bg: string = "#e8e8e8";
  public fg: string = "#000";

  draw(state: State) {
    state.canvas.save();
    this.drawTopRuler(state);
    this.drawLeftRuler(state);
    state.canvas.restore();
  }

  drawTopRuler(state: State) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = this.bg;
    state.canvas.ctx.fillRect(0, 0, state.canvas.width, this.height);

    const cellWidth = state.grid.realCellWidth;
    const halfWidth = cellWidth / 2;
    const halfHeight = this.height / 2;
    const offset = state.grid.offsetX + this.width;

    state.canvas.ctx.fillStyle = this.fg;

    for (let i = 1; i <= state.grid.cols; i++) {
      const str = String(i);
      const meas = state.canvas.ctx.measureText(str);
      const textWidth = meas.width;

      const cellOffset = cellWidth - (halfWidth - textWidth / 2);
      const coord = i * cellWidth - cellOffset;
      const x = coord + offset;

      const height =
        meas.actualBoundingBoxDescent + meas.actualBoundingBoxAscent;

      const y = halfHeight - height / 2 + height; // add height again because fillText y is the baseline
      state.canvas.ctx.fillText(str, x, y, cellWidth);
    }

    state.canvas.restore();
  }

  drawLeftRuler(state: State) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = this.bg;
    state.canvas.ctx.fillRect(0, 0, this.width, state.canvas.height);

    state.canvas.ctx.fillStyle = this.fg;
    const cellWidth = state.grid.realCellWidth;
    const cellHeight = state.grid.realCellHeight;
    const halfHeight = cellHeight / 2;
    const offset = state.grid.offsetY + this.height;
    const halfWidth = this.width / 2;

    for (let i = 1; i <= state.grid.rows; i++) {
      const str = String(i);
      const meas = state.canvas.ctx.measureText(str);

      // Y
      const coord = i * cellHeight;

      const height =
        meas.actualBoundingBoxDescent + meas.actualBoundingBoxAscent;

      const textYOffset = halfHeight - height / 2;
      // coord is the bottom of a cell, so we add the offset to go "up" to the baseline of the text
      const y = coord - textYOffset + offset;

      // X
      const textWidth = meas.width;
      const x = halfWidth - textWidth / 2;

      state.canvas.ctx.fillText(str, x, y, cellWidth);
    }

    state.canvas.restore();
  }
}
