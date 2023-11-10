import { State } from "../state";
import { Command } from "./command";

export class History {
  cursor: number = -1;
  commands: Command[] = [];
  queue: Command[] = [];

  limit: number = Infinity;

  constructor(limit?: number) {
    if (limit !== undefined) {
      this.limit = limit;
    }
  }

  public push(command: Command): this {
    this.queue.push(command);
    return this;
  }

  public execute(state: State): this {
    for (let i = 0; i < this.queue.length; i++) {
      const command = this.queue[i];
      this.runCommand(state, command);
    }

    this.queue = [];

    return this;
  }

  public undo(state: State) {
    const command = this.commands[this.cursor];

    if (!command) {
      return;
    }

    command.undo(state);
    this.cursor = this.cursor - 1;
  }

  public redo(state: State) {
    const cursor = this.cursor + 1;
    const command = this.commands[cursor];

    if (!command) {
      return;
    }

    command.execute(state);
    this.cursor = cursor;
  }

  private runCommand(state: State, command: Command) {
    // None of this matters if the command does not want to be tracked
    if (!command.execute(state)) {
      return;
    }

    // if cursor is not at the end then trim commands so cursor is at the end
    // This is done so new commands create a new undo history
    if (this.cursor < this.commands.length - 1) {
      this.commands = this.commands.slice(0, this.cursor + 1);
    }

    // Set cursor to the new (length - 1)
    // note: push returns new length
    this.cursor = this.commands.push(command) - 1;

    // If we have exceeded the limit, remove the first element and update cursor accordingly
    if (this.commands.length > this.limit) {
      this.commands.shift();
      this.cursor--;
    }
  }
}
