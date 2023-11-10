export class Canvas {
  #height: number;
  #width: number;
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

  constructor(id: string) {
    // Get canvas element and context
    this.id = id;
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;

    if (!canvas || !canvas.getContext) {
      throw new Error(
        `Canvas element ${id} does not exist or is not <canvas> element`,
      );
    }

    this.element = canvas as HTMLCanvasElement;

    const context = canvas.getContext("2d", { alpha: false })!;
    this.ctx = context;

    // Size
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays

    this.dpr = window.devicePixelRatio;

    const boundingRect = this.element.getBoundingClientRect();

    const height = boundingRect.height;
    const width = boundingRect.width;

    this.#height = height;
    this.#width = width;

    this.element.height = height * this.dpr;
    this.element.width = width * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);

    // Set the "drawn" size of the canvas
    this.element.style.width = `${boundingRect.width}px`;
    this.element.style.height = `${boundingRect.height}px`;
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.#width, this.#height);
  }
}
