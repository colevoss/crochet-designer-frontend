import { State } from "../state";

export enum ModeType {
  Paint = "PAINT",
  Select = "SELECT",
  Erase = "ERASE",
}

export interface Mode {
  mode: ModeType;

  mouseDown(state: State, event: MouseEvent): void;
  mouseUp(state: State, event: MouseEvent): void;
  mouseMove(state: State, event: MouseEvent): void;

  keyDown(state: State, event: KeyboardEvent): void;
  keyUp(state: State, event: KeyboardEvent): void;
}
