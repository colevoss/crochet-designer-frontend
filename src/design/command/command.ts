import { State } from "../state";

export abstract class Command {
  public abstract execute(state: State): boolean;

  // @ts-ignore
  public undo(state: State): void {}

  public msg(): string {
    return "";
  }
}
