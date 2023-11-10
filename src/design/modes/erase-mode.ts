import { EraseCommand, EraseStrokeCommand } from "../command";
import { State } from "../state";
import { Maybe } from "../types";
import { BaseMode } from "./base-mode";
import { ModeType } from "./mode";

enum EraseModeState {
  Idle,
  MouseDown,
  Dragging,
}

export class EraseMode extends BaseMode {
  mode = ModeType.Erase;

  state: EraseModeState = EraseModeState.Idle;

  private eraseStrokeCommand: Maybe<EraseStrokeCommand>;

  public mouseDown(state: State, event: MouseEvent): void {
    this.state = EraseModeState.MouseDown;
    this.eraseStrokeCommand = new EraseStrokeCommand();

    this.eraseCell(state, event.offsetX, event.offsetY);
    state.history.push(this.eraseStrokeCommand).execute(state);
  }

  public mouseUp(_state: State, _event: MouseEvent): void {
    this.state = EraseModeState.Idle;
    this.eraseStrokeCommand = undefined;
  }

  public mouseMove(state: State, event: MouseEvent): void {
    if (this.state === EraseModeState.Idle) {
      return;
    }

    this.state = EraseModeState.Dragging;
    this.eraseCell(state, event.offsetX, event.offsetY);
  }

  private eraseCell(state: State, x: number, y: number) {
    if (this.eraseStrokeCommand === undefined) {
      return;
    }

    const idx = state.grid.getIdxAtCoord(x, y);
    const cell = state.cells.get(idx);

    if (!cell) {
      return;
    }

    const erase = new EraseCommand(cell);
    this.eraseStrokeCommand.addEraseCommand(state, erase);
  }
}
