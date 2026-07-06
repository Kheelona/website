import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Brand fonts (variable TTFs copied from Design/design-system/fonts/)
export const fontsReady = Promise.all([
  loadFont({
    family: "Glory",
    url: staticFile("Glory-VariableFont_wght.ttf"),
    weight: "100 900",
  }),
  loadFont({
    family: "Instrument Sans",
    url: staticFile("InstrumentSans-VariableFont_wdth_wght.ttf"),
    weight: "100 900",
  }),
]);
