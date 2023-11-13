import { KeyCode } from "../keycodes";
import { State } from "../state";
import { Mode, ModeType } from "./mode";

export abstract class BaseMode implements Mode {
  public abstract readonly mode: ModeType;
  private metaPressed: boolean = false;

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

      case KeyCode.MetaLeft:
      case KeyCode.MetaRight:
        this.metaPressed = true;
        break;
    }
  }

  // @ts-ignore
  public keyUp(state: State, event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.MetaLeft:
      case KeyCode.MetaRight:
        this.metaPressed = false;
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

  public wheel(state: State, event: WheelEvent): void {
    event.preventDefault();
    requestAnimationFrame(() => this.onWheel(state, event));
  }

  private onWheel(state: State, event: WheelEvent): void {
    if (this.metaPressed) {
      state.grid.zoom(-event.deltaY / 3000);
    } else {
      state.grid.scroll(-event.deltaX, -event.deltaY);
    }

    state.draw();
  }
}
