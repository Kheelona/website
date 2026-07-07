import "./index.css";
import { Composition } from "remotion";
import { FilmTwoFriendsVeo } from "./FilmTwoFriendsVeo";
import { VeoSeeds } from "./VeoSeeds";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FilmTwoFriendsVeo"
        component={FilmTwoFriendsVeo}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="VeoSeeds"
        component={VeoSeeds}
        durationInFrames={3}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
