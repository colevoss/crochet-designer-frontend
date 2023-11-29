import { PaintCellCommand, PaintStrokeCommand } from "../command";
import { KeyCode, numFromDigitKey } from "../keycodes";
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
    super.mouseMove(state, event);
    if (this.state === PaintModeState.Idle) {
      return;
    }

    this.state = PaintModeState.Dragging;

    this.paintCell(state, event.offsetX, event.offsetY);
  }

  public keyDown(state: State, event: KeyboardEvent): void {
    super.keyDown(state, event);
    let paletteId: Maybe<number>;

    switch (event.code) {
      case KeyCode.Digit1:
      case KeyCode.Digit2:
      case KeyCode.Digit3:
      case KeyCode.Digit4:
      case KeyCode.Digit5:
      case KeyCode.Digit6:
      case KeyCode.Digit7:
      case KeyCode.Digit8:
      case KeyCode.Digit9:
        paletteId = numFromDigitKey(event.code);
        break;
    }

    if (paletteId === undefined) {
      return;
    }

    state.palette.select(paletteId - 1);
  }

  private paintCell(state: State, x: number, y: number) {
    if (this.paintStrokeCommand === undefined) {
      return;
    }

    const idx = state.grid.getIdxAtCoord(x, y);
    if (this.paintStrokeCommand.lastPaintedIdx() === idx) {
      return;
    }

    const color = state.palette.selected;

    if (color === undefined) {
      return;
    }

    const paint = new PaintCellCommand(idx, color);
    this.paintStrokeCommand.addCellPaint(state, paint);
  }
}
