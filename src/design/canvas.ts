import { ICanvas } from "./icanvas";

export class Canvas implements ICanvas {
  #height: number = 0;
  #width: number = 0;
  id: string;

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dpr: number;

  public get height(): number {
    return this.#height;
  }

  public get width(): number {
    return this.#width;
  }

  public container: HTMLElement;

  constructor(id: string) {
    this.id = id;

    const container = document.getElementById(id);

    if (container === null) {
      throw new Error(`Element ${id} does not exist`);
    }

    this.container = container;

    this.element = document.createElement("canvas");
    this.element.id = "crochet-canvas";
    this.container.appendChild(this.element);

    this.ctx = this.element.getContext("2d", { alpha: true })!;
    this.dpr = window.devicePixelRatio;

    this.ctx.scale(this.dpr, this.dpr);
    this.prepareDraw();
  }

  public setDimensions(h: number, w: number) {
    this.#height = h;
    this.#width = w;

    this.updateElement();
  }

  // I think I want the height and width setting to be done in the State component
  private prepareDraw() {
    const toolbar = document.getElementById("toolbar")!;
    const toolbarHeight = toolbar.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;

    const height = windowHeight - toolbarHeight;
    const width = window.innerWidth;
    // this.updateElement();

    this.setDimensions(height, width);
  }

  private updateElement() {
    this.element.height = this.#height * this.dpr;
    this.element.width = this.#width * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);

    this.element.style.width = `${this.#width}px`;
    this.element.style.height = `${this.#height}px`;
  }

  public save() {
    this.ctx.save();
  }

  public restore() {
    this.ctx.restore();
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.#width, this.#height);
  }
}
