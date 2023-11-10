import { Draw } from "../draw";
import { State } from "../state";
import { CellDimensions, Maybe } from "../types";

export class Cell implements Draw {
  idx: number;

  fill: Maybe<string>;
  stroke: string = "#888";

  col: number;
  row: number;

  constructor(state: State, idx: number) {
    this.idx = idx;

    this.col = idx % state.grid.cols;
    this.row = Math.floor(idx / state.grid.cols);
  }

  draw(state: State) {
    if (!state.grid.isCellVisible(this.col, this.row)) {
      return;
    }

    if (this.fill === undefined) {
      return;
    }

    const [x, y, w, h] = this.dimensions(state);

    state.canvas.ctx.save();

    state.canvas.ctx.clearRect(x, y, w, h);

    state.canvas.ctx.fillStyle = this.fill;
    state.canvas.ctx.fillRect(x, y, w, h);

    state.canvas.ctx.restore();
  }

  dimensions(state: State): CellDimensions {
    return state.grid.getCellDimmension(this.col, this.row);
  }
}
