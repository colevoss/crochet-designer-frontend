import { Plus } from "lucide-react";
import { usePalette } from "@/design/design-provider";
import { PaletteColor } from "./palette-color";

export function PalettePicker() {
  const [palette, colors = [], selected] = usePalette();

  return (
    <div>
      <div className="flex flex-row space-x-1 p-2">
        {colors.map((c) => {
          return (
            <PaletteColor
              key={`${c.id}-${c.color}`}
              color={c}
              onClick={() => palette.select(c.id)}
              selected={c.id === selected?.id}
            />
          );
        })}

        <button
          className="p-3 bg-neutral-100 hover:bg-neutral-200"
          onClick={() => palette.newColor("#2f3ae0")}
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}
