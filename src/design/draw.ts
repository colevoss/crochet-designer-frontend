import { State } from "./state";

export interface Draw {
  draw(canvas: State): void;
}
