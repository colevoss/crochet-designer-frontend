import { Brush, Eraser } from "lucide-react";
import { ModeButton } from "./mode-button";
import { useDesign, useModeType, ModeType } from "@/design";
import { ToolButton } from "@/components/tool-button";

export function ModePicker() {
  const design = useDesign();
  const modeType = useModeType();

  return (
    <div className="flex flex-row grow-0 space-x-1 p-2">
      <ToolButton
        onClick={() => design.setMode(ModeType.Paint)}
        desc="Paint (A)"
      >
        <ModeButton selected={modeType === ModeType.Paint}>
          <Brush size={16} />
        </ModeButton>
      </ToolButton>

      <ToolButton
        onClick={() => design.setMode(ModeType.Erase)}
        desc="Erase (E)"
      >
        <ModeButton selected={modeType === ModeType.Erase}>
          <Eraser size={16} />
        </ModeButton>
      </ToolButton>
    </div>
  );
}
