import { Draw } from "../draw";
import { State } from "../state";
import { Maybe } from "../types";
import { Cell } from "./cell";

export class CellMap implements Draw {
  sparse: Maybe<number>[];
  cells: Cell[] = [];

  constructor(w: number, h: number) {
    this.sparse = new Array(w * h);
  }

  public get(idx: number): Maybe<Cell> {
    this.assertInRange(idx);
    const denseIdx = this.sparse[idx];

    if (denseIdx === undefined) {
      return;
    }

    return this.cells[denseIdx];
  }

  public add(state: State, idx: number): Cell {
    this.assertInRange(idx);

    const cell = new Cell(state, idx);
    const length = this.cells.push(cell);
    const denseIdx = length - 1;
    this.sparse[idx] = denseIdx;

    return cell;
  }

  public getOrAdd(state: State, idx: number): Cell {
    const cell = this.get(idx);

    if (cell !== undefined) {
      return cell;
    }

    return this.add(state, idx);
  }

  public addCell(cell: Cell): void {
    const length = this.cells.push(cell);
    this.sparse[cell.idx] = length - 1;
  }

  public delete(idx: number): Maybe<Cell> {
    this.assertInRange(idx);
    const denseIndex = this.sparse[idx];

    if (denseIndex === undefined) {
      return;
    }

    const newCell = this.cells.pop();
    if (!newCell) {
      return;
    }

    if (newCell.idx === idx) {
      this.sparse[idx] = undefined;
      return;
    }

    this.cells[denseIndex] = newCell;
    this.sparse[newCell.idx] = denseIndex;
    this.sparse[idx] = undefined;
  }

  private assertInRange(idx: number): void {
    if (idx >= this.sparse.length) {
      throw new Error(`index ${idx} out of range`);
    }
  }

  public draw(state: State): void {
    const cellCount = this.cells.length;

    for (let i = 0; i < cellCount; i++) {
      this.cells[i].draw(state);
    }
  }
}
