import "./App.css";
import { ModePicker } from "./components/mode/mode-picker";
import { PalettePicker } from "./components/palette/palette-picker";
import { Commands } from "@/components/commands/commands";

function App() {
  return (
    <div className="flex flex-row bg-white align-top divide-x divide-neutral-300 p-2 space-x-5">
      <Commands />
      <ModePicker />
      <PalettePicker />
    </div>
  );
}

export default App;
