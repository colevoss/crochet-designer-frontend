import { ModeType } from "./modes";
import { ColorData, Palette } from "./pallette";
import { State } from "./state";
import { createContext, useContext, useEffect, useState } from "react";
import { Maybe } from "./types";

const DesignContext = createContext<undefined | State>(undefined);

type Props = {
  children: React.ReactNode;
  design: State;
};

export function useDesign(): State {
  const design = useContext(DesignContext);

  if (!design) {
    throw new Error("Design is not a thing");
  }

  return design;
}

export function useModeType(): ModeType {
  const design = useDesign();
  const [modeType, setModeType] = useState<ModeType>(design.mode.mode);

  useEffect(() => {
    const unsub = design.on("mode", (newModeType) => {
      setModeType(() => newModeType);
    });

    return unsub;
  }, []);

  return modeType;
}

export function usePalette(): [Palette, ColorData[], Maybe<ColorData>] {
  const design = useDesign();
  const palette = design.palette;
  const [colors, setColors] = useState<ColorData[]>(palette.rawData());
  const [selected, setSelected] = useState<Maybe<ColorData>>(
    palette.selected?.data(),
  );

  useEffect(() => {
    const colorUnsub = palette.on("color", () => {
      setColors(palette.rawData());
    });

    return colorUnsub;
  }, []);

  useEffect(() => {
    const selectUnsub = palette.on("select", (newSelected) => {
      setSelected(newSelected.data());
    });

    return selectUnsub;
  }, []);

  return [palette, colors, selected];
}

export function DesignProvider({ design, children }: Props) {
  useEffect(() => {
    design.mount();
  }, [design]);

  return (
    <DesignContext.Provider value={design}>{children}</DesignContext.Provider>
  );
}
