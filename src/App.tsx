import "./App.css";
import { useDesign, useModeType, usePalette } from "./design";
import { ModeType } from "./design/modes";

function App() {
  const design = useDesign();
  const modeType = useModeType();
  const [palette, colors = [], selected] = usePalette();

  console.log(selected);

  return (
    <div>
      <button
        disabled={modeType === ModeType.Paint}
        onClick={() => design.setMode(ModeType.Paint)}
      >
        Paint
      </button>
      <button
        disabled={modeType === ModeType.Erase}
        onClick={() => design.setMode(ModeType.Erase)}
      >
        Erase
      </button>

      <div>
        {colors.map((c) => {
          return (
            <div key={c.id + c.color}>
              {c.id} - {c.color} {c.id === selected?.id ? "x" : ""}
            </div>
          );
        })}
        <button onClick={() => palette.select(1)}>Heh</button>
      </div>
    </div>
  );
}

export default App;
