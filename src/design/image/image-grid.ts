import { BaseGrid } from "../grid";
import { Ruler } from "../grid/ruler";

const IMAGE_BASE = 3000;

export class ImageGrid extends BaseGrid {
  public ruler: Ruler;
  public rows: number;
  public cols: number;
  public height: number;
  public width: number;
  public cellWidth: number;
  public cellHeight: number;

  constructor(cols: number, rows: number) {
    super();

    this.ruler = new Ruler({ size: 50 });

    this.cols = cols;
    this.rows = rows;

    const width = IMAGE_BASE;
    const height = IMAGE_BASE * (Math.min(cols, rows) / Math.max(cols, rows));

    this.cellWidth = width / cols;
    this.cellHeight = height / rows;

    this.width = width + this.ruler.width;
    this.height = height + this.ruler.height;
  }
}
