import { PaintCellCommand, PaintStrokeCommand } from "../command";
import { State } from "../state";
import { Maybe } from "../types";
import { BaseMode } from "./base-mode";
import { ModeType } from "./mode";

enum PaintModeState {
  Idle,
  MouseDown,
  Dragging,
}

export class PaintMode extends BaseMode {
  mode: ModeType = ModeType.Paint;
  state: PaintModeState = PaintModeState.Idle;

  private paintStrokeCommand: Maybe<PaintStrokeCommand>;

  public mouseDown(state: State, event: MouseEvent): void {
    this.state = PaintModeState.MouseDown;
    this.paintStrokeCommand = new PaintStrokeCommand();
    this.paintCell(state, event.offsetX, event.offsetY);

    state.history.push(this.paintStrokeCommand).execute(state);
  }

  public mouseUp(_state: State, _event: MouseEvent): void {
    this.state = PaintModeState.Idle;
    this.paintStrokeCommand = undefined;
  }

  public mouseMove(state: State, event: MouseEvent): void {
    if (this.state === PaintModeState.Idle) {
      return;
    }

    this.state = PaintModeState.Dragging;

    this.paintCell(state, event.offsetX, event.offsetY);
  }

  private paintCell(state: State, x: number, y: number) {
    if (this.paintStrokeCommand === undefined) {
      return;
    }

    const idx = state.grid.getIdxAtCoord(x, y);
    if (this.paintStrokeCommand.lastPaintedIdx() === idx) {
      return;
    }

    const paint = new PaintCellCommand(idx, "#000");
    this.paintStrokeCommand.addCellPaint(state, paint);
  }
}
