import { State, useDesign } from "@/design";

function download(design: State) {
  const link = document.createElement("a");
  // link.style = "display:hidden";
  link.download = "test.png";
  link.href = design.canvas.element.toDataURL("image/png");
  link.click();
  link.remove();
}

export function Downloader() {
  const design = useDesign();

  return <button onClick={() => download(design)}>Download</button>;
}
