import { Palette } from "lucide-react";
import { ColorData } from "@/design/pallette";
import { cva } from "class-variance-authority";
import { ToolButton } from "../tool-button";

type Props = {
  selected: boolean;
  onClick: () => void;
  color: ColorData;
};

const colorVariance = cva("p-3 rounded text-lg hover:text-xl", {
  variants: {
    mode: {
      selected: "outline outline-blue-500 outline-2 outline-offset-1",
      default: "",
    },
  },
});

export function PaletteColor({ color, selected, onClick }: Props) {
  return (
    <ToolButton onClick={onClick} desc={`${color.id + 1}`}>
      <div
        className={colorVariance({ mode: selected ? "selected" : "default" })}
        style={{ background: color.color }}
      >
        <Palette style={{ color: color.color }} size={16} />
      </div>
    </ToolButton>
  );
}
