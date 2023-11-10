import { KeyCode } from "../keycodes";
import { State } from "../state";
import { Mode, ModeType } from "./mode";

export abstract class BaseMode implements Mode {
  public abstract readonly mode: ModeType;

  // @ts-ignore
  public mouseDown(state: State, event: MouseEvent) {}
  // @ts-ignore
  public mouseUp(state: State, event: MouseEvent) {}
  // @ts-ignore
  public mouseMove(state: State, event: MouseEvent) {}

  // @ts-ignore
  public keyDown(state: State, event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.A:
        this.paintMode(state);
        break;

      case KeyCode.E:
        this.eraseMode(state);
        break;

      case KeyCode.Z:
        this.handleUndo(state, event);
        break;
    }
  }

  private paintMode(state: State) {
    state.setMode(ModeType.Paint);
  }

  private eraseMode(state: State) {
    state.setMode(ModeType.Erase);
  }

  private handleUndo(state: State, event: KeyboardEvent) {
    if (!event.getModifierState("Meta")) {
      return;
    }

    if (event.getModifierState("Shift")) {
      state.history.redo(state);
      return;
    }

    state.history.undo(state);
  }

  // @ts-ignore
  public keyUp(state: State, event: KeyboardEvent) {}
}
