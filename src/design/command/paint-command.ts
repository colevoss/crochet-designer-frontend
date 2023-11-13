import { Color } from "../pallette";
import { State } from "../state";
import { Maybe } from "../types";
import { Command } from "./command";

export class PaintCellCommand extends Command {
  private prevColor: Maybe<Color>;

  constructor(
    public idx: number,
    public color: Color,
  ) {
    super();
  }

  public execute(state: State): boolean {
    const cell = state.cells.getOrAdd(state, this.idx);

    if (cell.color === this.color) {
      return false;
    }

    this.prevColor = cell.color;
    cell.color = this.color;
    cell.draw(state);

    return true;
  }

  public undo(state: State) {
    const cell = state.cells.get(this.idx);

    if (!cell) {
      return;
    }

    if (this.prevColor) {
      cell.color = this.prevColor;
      cell.draw(state);
      return;
    }

    state.grid.clearCell(state, cell.col, cell.row);
    state.cells.delete(cell.idx);
    return;
  }

  public msg(): string {
    return "Painting cell";
  }
}

export class PaintStrokeCommand extends Command {
  private paintCells: PaintCellCommand[] = [];

  public execute(state: State): boolean {
    for (let i = 0; i < this.paintCells.length; i++) {
      this.paintCells[i].execute(state);
    }

    return true;
  }

  public undo(state: State): void {
    for (let i = this.paintCells.length - 1; i >= 0; i--) {
      this.paintCells[i].undo(state);
    }
  }

  public addCellPaint(state: State, paint: PaintCellCommand) {
    paint.execute(state);
    this.paintCells.push(paint);
  }

  public lastPaintedIdx(): Maybe<number> {
    const lastPaint = this.paintCells[this.paintCells.length - 1];

    return lastPaint?.idx;
  }
}
