export interface ICanvas {
  height: number;
  width: number;

  ctx: CanvasRenderingContext2D;
  element: HTMLCanvasElement;

  save(): void;
  restore(): void;
}
