import "./index.css";
import { Composition } from "remotion";
import { LaunchTeaser } from "./LaunchTeaser";
import { ProductFilm } from "./ProductFilm";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductFilm"
        component={ProductFilm}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchTeaser"
        component={LaunchTeaser}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ vertical: false }}
      />
      <Composition
        id="LaunchTeaserVertical"
        component={LaunchTeaser}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ vertical: true }}
      />
    </>
  );
};
