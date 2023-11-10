import { Draw } from "../draw";
import { State } from "../state";

export class Ruler implements Draw {
  public readonly height: number = 25;
  public readonly width: number = 25;

  draw(state: State) {
    this.drawTopRuler(state);
    this.drawLeftRuler(state);

    state.canvas.save();

    state.canvas.ctx.fillStyle = "#dddddd";
    state.canvas.ctx.fillRect(0, 0, this.width, this.height);

    state.canvas.restore();
  }

  drawTopRuler(state: State) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = "#dddddd";
    state.canvas.ctx.fillRect(0, 0, state.canvas.width, this.height);

    const cellWidth = state.grid.realCellWidth;

    state.canvas.ctx.fillStyle = "#000";
    for (let i = 0; i < state.grid.cols; i++) {
      const offset = state.grid.offsetX + this.width;
      const coord = (i + 1) * cellWidth - cellWidth / 2;
      const x = coord + offset;

      state.canvas.ctx.fillText(`${i + 1}`, x, this.height / 2);
    }

    state.canvas.restore();
  }

  drawLeftRuler(state: State) {
    state.canvas.save();

    state.canvas.ctx.fillStyle = "#dddddd";
    state.canvas.ctx.fillRect(0, 0, this.width, state.canvas.height);

    state.canvas.ctx.fillStyle = "#000";
    const cellHeight = state.grid.realCellHeight;

    for (let i = 0; i < state.grid.rows; i++) {
      const offset = state.grid.offsetY + this.height;
      const coord = (i + 1) * cellHeight - cellHeight / 2;
      const y = coord + offset;

      state.canvas.ctx.fillText(`${i + 1}`, this.width / 2, y);
    }

    state.canvas.restore();
  }
}
