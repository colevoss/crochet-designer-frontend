import { Undo, Redo } from "lucide-react";
import { useDesign, useHistory } from "@/design";
import { ToolButton } from "../tool-button";

export function Commands() {
  const design = useDesign();
  const { canRedo, canUndo } = useHistory();

  return (
    <div className="flex flex-row space-x-1 p-2">
      <ToolButton desc="Undo" onClick={() => design.history.undo(design)}>
        <CommandButton>
          <Undo
            className={canUndo ? "text-black" : "text-neutral-200"}
            size={16}
          />
        </CommandButton>
      </ToolButton>

      <ToolButton desc="Redo" onClick={() => design.history.redo(design)}>
        <CommandButton>
          <Redo
            className={canRedo ? "text-black" : "text-neutral-200"}
            size={16}
          />
        </CommandButton>
      </ToolButton>
    </div>
  );
}

function CommandButton({ children }: { children: React.ReactNode }) {
  return <div className="p-3">{children}</div>;
}
