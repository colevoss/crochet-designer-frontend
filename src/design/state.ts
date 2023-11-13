import { Canvas } from "./canvas";
import { CellMap } from "./cell";
import { History } from "./command";
import { EventEmitter } from "./event-emitter";
import { Grid } from "./grid";
import { EraseMode, Mode, ModeType, PaintMode } from "./modes";
import { Palette } from "./pallette";

export type Options = {
  cols: number;
  rows: number;
  id: string;
  size?: number;
  historySize?: number;
};

interface StateEvent {
  mode: ModeType;
  test: number;
}

export class State extends EventEmitter<StateEvent> {
  backgroundColor: string = "#fff";
  canvas: Canvas;
  history: History;

  metaPressed = false;

  cells: CellMap;

  hovered: number | null = null;

  grid: Grid;

  mounted: boolean = false;

  mode: Mode;

  #modes = {
    paintMode: new PaintMode(),
    eraseMode: new EraseMode(),
  };

  public readonly palette: Palette = new Palette();

  constructor(options: Options) {
    super();
    this.history = new History(options.historySize);

    this.createPalette();

    this.mode = new PaintMode();
    this.canvas = new Canvas(options.id);
    this.grid = new Grid(this, options);
    this.cells = new CellMap(this.grid.cols, this.grid.rows);

    window.s = this;
  }

  public mount() {
    if (this.mounted) {
      return;
    }

    this.registerInput();
    this.draw();
    this.mounted = true;
  }

  public createPalette() {
    this.palette.newColor("#000");
    this.palette.newColor("#09f97d");
    this.palette.newColor("#09f9f5");
    this.palette.select(0);

    this.palette.on("update-color", () => this.draw());
  }

  public setMode(mode: ModeType) {
    switch (mode) {
      case ModeType.Paint:
        this.mode = this.#modes.paintMode;
        break;

      case ModeType.Erase:
        this.mode = this.#modes.eraseMode;
        break;

      case ModeType.Select:
        console.log("mode", mode);
        break;

      default:
        return;
    }

    this.emit("mode", mode);
  }

  private registerInput() {
    this.registerClick();
    this.registerKey();
    this.registerScroll();
    this.registerMouseMove();
  }

  public draw() {
    this.canvas.clear();
    this.canvas.save();

    this.canvas.ctx.fillStyle = "#fff";
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.restore();

    this.grid.draw(this);
    this.cells.draw(this);
  }

  private registerMouseMove() {
    this.canvas.element.addEventListener("mousemove", (event) => {
      this.mode.mouseMove(this, event);
    });
  }

  private registerClick() {
    this.canvas.element.addEventListener("mousedown", (event) => {
      this.mode.mouseDown(this, event);
    });

    this.canvas.element.addEventListener("mouseup", (event) => {
      this.mode.mouseUp(this, event);
    });
  }

  private registerKey() {
    document.addEventListener("keydown", (event) => {
      this.mode.keyDown(this, event);
    });

    document.addEventListener("keyup", (event) => {
      this.mode.keyUp(this, event);
    });
  }

  private registerScroll() {
    this.canvas.element.addEventListener("wheel", (event) => {
      event.preventDefault();
      requestAnimationFrame(() => this.onWheel(event));
    });
  }

  private onWheel(event: WheelEvent) {
    if (!this.metaPressed) {
      this.grid.scroll(-event.deltaX, -event.deltaY);
    } else {
      this.grid.zoom(-event.deltaY / 3000);
    }

    this.draw();
  }
}
