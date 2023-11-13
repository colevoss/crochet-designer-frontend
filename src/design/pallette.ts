import { EventEmitter } from "./event-emitter";
import { Maybe } from "./types";

export type ColorData = {
  id: number;
  color: string;
};

export class Color {
  id: number;
  color: string;

  constructor(id: number, desc: string) {
    this.id = id;
    this.color = desc;
  }

  data(): ColorData {
    return {
      id: this.id,
      color: this.color,
    };
  }
}

type PaletteEvents = {
  "new-color": Color;
  "update-color": Color;
  color: Color;
  select: Color;
};

export class Palette extends EventEmitter<PaletteEvents> {
  #colors: Color[] = [];
  #selected: Maybe<Color>;

  public select(id: number) {
    if (id === this.#selected?.id) {
      return;
    }

    const selected = this.getColor(id);

    if (selected === undefined) {
      return;
    }

    this.#selected = selected;
    this.emit("select", this.#selected);
  }

  public get selected(): Maybe<Color> {
    return this.#selected;
  }

  public colors(): Color[] {
    return this.#colors;
  }

  public newColor(colorStr: string): Color {
    const color = new Color(this.#colors.length, colorStr);
    this.#colors.push(color);
    this.emit("new-color", color);

    return color;
  }

  public getColor(id: number): Maybe<Color> {
    return this.#colors[id];
  }

  public setColor(id: number, description: string) {
    const color = this.getColor(id);

    if (color === undefined) {
      // color = new Color(id, description);
      // this.#colors[id] = color;
      // this.emit("new-color", color);

      return;
    }

    color.color = description;

    this.emit("update-color", color);
  }

  public rawData() {
    return this.#colors.map((c) => c.data());
  }

  public urlData() {
    return this.#colors.map((c) => c.color).join();
  }
}
