import { Draw } from "../draw";
import { IState } from "../istate";
import { Color } from "../pallette";
import { CellDimensions, Maybe } from "../types";

export class Cell implements Draw {
  public readonly idx: number;

  public color: Maybe<Color>;

  public readonly col: number;
  public readonly row: number;

  constructor(state: IState, idx: number) {
    this.idx = idx;

    this.col = idx % state.grid.cols;
    this.row = Math.floor(idx / state.grid.cols);
  }

  public draw(state: IState) {
    if (!state.grid.isCellVisible(this.col, this.row)) {
      return;
    }

    if (this.color === undefined) {
      return;
    }

    const [x, y, w, h] = this.dimensions(state);

    state.canvas.ctx.save();

    state.canvas.ctx.clearRect(x, y, w, h);

    state.canvas.ctx.fillStyle = this.color.color;
    state.canvas.ctx.fillRect(x, y, w, h);

    state.canvas.ctx.restore();
  }

  private dimensions(state: IState): CellDimensions {
    return state.grid.getCellDimmension(this.col, this.row);
  }
}
