import { Cell } from "../cell";
import { State } from "../state";
import { Maybe } from "../types";
import { Command } from "./command";

export class EraseCommand extends Command {
  constructor(public cell: Cell) {
    super();
  }

  public execute(state: State): boolean {
    state.grid.clearCell(state, this.cell.col, this.cell.row);
    state.cells.delete(this.cell.idx);

    return true;
  }

  public undo(state: State): void {
    state.cells.addCell(this.cell);
    this.cell.draw(state);
  }
}

export class EraseStrokeCommand extends Command {
  private eraseCommands: EraseCommand[] = [];

  public execute(state: State): boolean {
    for (let i = 0; i < this.eraseCommands.length; i++) {
      this.eraseCommands[i].execute(state);
    }

    return true;
  }

  public undo(state: State): void {
    for (let i = this.eraseCommands.length - 1; i >= 0; i--) {
      this.eraseCommands[i].undo(state);
    }
  }

  public addEraseCommand(state: State, erase: EraseCommand) {
    erase.execute(state);
    this.eraseCommands.push(erase);
  }

  public lastErasedIdx(): Maybe<number> {
    const lastErased = this.eraseCommands[this.eraseCommands.length - 1];

    return lastErased?.cell.idx;
  }
}
