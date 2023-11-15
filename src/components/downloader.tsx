import { Download } from "lucide-react";
import { State, useDesign } from "@/design";
import { ToolButton } from "./tool-button";

function download(design: State) {
  const link = document.createElement("a");
  link.download = `design-${Date.now()}.png`;
  const imageState = design.createImageState();
  imageState.draw();
  link.href = imageState.canvas.element.toDataURL("image/png");
  link.click();
  link.remove();
}

export function Downloader() {
  const design = useDesign();

  return (
    <div className="flex flex-1 flex-row justify-end p-2">
      <ToolButton onClick={() => download(design)} desc="Download">
        <div className="p-3">
          <Download size={16} />
        </div>
      </ToolButton>
    </div>
  );
}
