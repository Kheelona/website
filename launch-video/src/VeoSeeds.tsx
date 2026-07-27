import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C } from "./tokens";
import { Shape } from "./shapes";
import "./fonts";

// ————————————————————————————————————————————————————————————
// VeoSeeds — text-free 1920×1080 start frames for Veo 3 image-to-video.
// frame 0 = Hello (yellow), frame 1 = Play (cool), frame 2 = Cuddle (cream).
// Render: npx remotion still VeoSeeds --frame=N out.png
// ————————————————————————————————————————————————————————————

const Ground: React.FC<{ color?: string; opacity?: number }> = ({ color = "#FFFFFF", opacity = 0.85 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: -320,
      width: 1700,
      height: 560,
      transform: "translateX(-50%)",
      borderRadius: "50%",
      background: color,
      opacity,
    }}
  />
);

const Hello: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.yellow }}>
    <Shape kind="flower5" size={260} color={C.white} style={{ top: 90, left: 120, opacity: 0.45 }} />
    <Shape kind="flower13" size={180} color={C.orangeDeep} style={{ top: 150, right: 170, opacity: 0.35 }} />
    <Ground opacity={0.55} />
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 40,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 190,
      }}
    >
      <Img
        src={staticFile("product-v2/cut-lumi-blue.png")}
        style={{ height: 640, objectFit: "contain", filter: "drop-shadow(0 26px 36px rgba(0,0,0,0.16))" }}
      />
      <Img
        src={staticFile("mascot-hero-wink.png")}
        style={{ height: 680, objectFit: "contain", filter: "drop-shadow(0 26px 36px rgba(0,0,0,0.16))" }}
      />
    </div>
  </AbsoluteFill>
);

const Play: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.cool }}>
    <Shape kind="flower13" size={220} color={C.blue} style={{ top: 100, right: 150, opacity: 0.8 }} />
    <Shape kind="squircle" size={170} color={C.teal} style={{ top: 160, left: 130, opacity: 0.8 }} />
    <Ground />
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 60,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 70,
      }}
    >
      <Img
        src={staticFile("mascot-joy.png")}
        style={{ height: 620, objectFit: "contain", filter: "drop-shadow(0 26px 36px rgba(0,0,0,0.14))" }}
      />
      <Img
        src={staticFile("product-v2/cut-lumi-blue.png")}
        style={{ height: 660, objectFit: "contain", filter: "drop-shadow(0 26px 36px rgba(41,160,215,0.2))" }}
      />
    </div>
  </AbsoluteFill>
);

const Cuddle: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.cream }}>
    <Shape kind="flower5" size={200} color={C.yellow} style={{ top: 120, left: 150, opacity: 0.6 }} />
    <Ground color={C.white} opacity={0.7} />
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 50,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 26,
      }}
    >
      <Img src={staticFile("mascot-bliss.png")} style={{ height: 560, objectFit: "contain" }} />
      <Img src={staticFile("product-v2/cut-lumi-blue.png")} style={{ height: 600, objectFit: "contain" }} />
    </div>
  </AbsoluteFill>
);

export const VeoSeeds: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame === 1) return <Play />;
  if (frame === 2) return <Cuddle />;
  return <Hello />;
};
