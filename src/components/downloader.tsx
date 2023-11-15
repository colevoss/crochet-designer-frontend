import { State, useDesign } from "@/design";

function download(design: State) {
  const link = document.createElement("a");
  // link.style = "display:hidden";
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
    <div className="flex flex-1 flex-row content-end items-center justify-end">
      <button onClick={() => download(design)}>Download</button>
    </div>
  );
}
