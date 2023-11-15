import { IState } from "./istate";

export interface Draw {
  draw(canvas: IState): void;
}
