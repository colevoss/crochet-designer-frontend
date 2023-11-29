import { IState } from "../istate";
import { Options } from "../state";
import { BaseGrid } from "./base-grid";
import { Ruler } from "./ruler";

export class Grid extends BaseGrid {
  public ruler: Ruler;
  public rows: number;
  public cols: number;
  public height: number;
  public width: number;
  public cellWidth: number;
  public cellHeight: number;

  constructor(state: IState, { cols, rows, size = 1 }: Options) {
    super();

    this.width = state.canvas.width;
    this.height = state.canvas.height;

    this.ruler = new Ruler();

    this.cols = cols;
    this.rows = rows;

    this.cellWidth = (this.width - this.ruler.width) / this.cols;
    this.cellHeight = this.cellWidth / size;
  }

  public refresh(state: IState) {
    this.width = state.canvas.width;
    this.height = state.canvas.height;

    this.cellWidth = (this.width - this.ruler.width * 2) / this.cols;
    this.cellHeight = this.cellWidth;
  }

  public urlData() {
    return {
      w: this.cols,
      h: this.rows,
    };
  }
}
