import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, EASE_BOUNCE, EASE_OUT, FONT } from "./tokens";
import "./fonts";

// ————————————————————————————————————————————————————————————
// FilmTwoFriendsVeo (30fps · 750 frames · 25s) — the founder-picked V2
// rebuilt from founder-generated Veo 3 clips (10s each, 720p24, muted).
//  S1   0–300  veo/hello.mp4  "Meet Lumi." + the listens-first line
//  S2 288–600  veo/play.mp4   "Really talks." + 10-languages line
//  S3 588–750  orange end card with the character lineup
// All on-screen text is verbatim site copy.
// ————————————————————————————————————————————————————————————

const easeOut = Easing.bezier(...EASE_OUT);
const easeBounce = Easing.bezier(...EASE_BOUNCE);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const sceneFade = (frame: number, inAt: number, outAt: number) =>
  interpolate(frame, [inAt, inAt + 12, outAt - 12, outAt], [0, 1, 1, 0], clamp);

const fadeUp = (frame: number, start: number, dur = 18) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut }),
  translate: `0px ${interpolate(frame, [start, start + dur], [36, 0], { ...clamp, easing: easeOut })}px`,
});

const fadeInOut = (frame: number, inAt: number, outAt: number, dur = 16) =>
  interpolate(frame, [inAt, inAt + dur, outAt - dur, outAt], [0, 1, 1, 0], { ...clamp, easing: easeOut });

// ——— S1: Hello ——————————————————————————————————————————————
const Hello: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, 0, 300) }}>
      <OffthreadVideo
        muted
        src={staticFile("veo/hello.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <h1
        style={{
          position: "absolute",
          left: 90,
          top: 90,
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 150,
          color: C.white,
          textShadow: "0 6px 30px rgba(140,70,0,0.45)",
          margin: 0,
          opacity: fadeInOut(frame, 18, 140),
          translate: `0px ${interpolate(frame, [18, 36], [36, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        Meet Lumi.
      </h1>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          textAlign: "center",
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.15,
          color: C.white,
          textShadow: "0 5px 26px rgba(140,70,0,0.5)",
          margin: "0 auto",
          maxWidth: 1500,
          opacity: fadeInOut(frame, 168, 296),
          translate: `0px ${interpolate(frame, [168, 186], [30, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        Lumi is a screen-free AI robot toy that listens first, then talks back.
      </p>
    </AbsoluteFill>
  );
};

// ——— S2: Play ———————————————————————————————————————————————
const Play: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, 0, 312) }}>
      <OffthreadVideo
        muted
        src={staticFile("veo/play.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <h2
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 84,
          textAlign: "center",
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 126,
          color: C.inkHead,
          textShadow: "0 4px 22px rgba(255,255,255,0.65)",
          margin: 0,
          opacity: fadeInOut(frame, 30, 150),
          translate: `0px ${interpolate(frame, [30, 48], [30, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        Really talks.
      </h2>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 84,
          textAlign: "center",
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 76,
          color: C.orangeDeep,
          textShadow: "0 3px 18px rgba(255,255,255,0.7)",
          margin: 0,
          opacity: fadeInOut(frame, 186, 308),
          translate: `0px ${interpolate(frame, [186, 204], [26, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        In all 10 languages you speak at home.
      </p>
    </AbsoluteFill>
  );
};

// ——— S3: the ask ————————————————————————————————————————————
const LINEUP = [
  { img: "mascot-grumpy.png", h: 300 },
  { img: "mascot-hero-wink.png", h: 360 },
  { img: "product-v2/cut-lumi-blue.png", h: 330 },
  { img: "mascot-silly.png", h: 320 },
  { img: "mascot-joy.png", h: 350 },
] as const;

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.orange, opacity: interpolate(frame, [0, 14], [0, 1], clamp) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}>
        <h2
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1.05,
            color: C.white,
            margin: "0 auto",
            maxWidth: 1300,
            ...fadeUp(frame, 8, 16),
          }}
        >
          Reserve Lumi before the price goes up.
        </h2>
        <p
          style={{
            fontFamily: FONT.text,
            fontWeight: 700,
            fontSize: 42,
            color: C.white,
            margin: "28px 0 0",
            ...fadeUp(frame, 24, 16),
          }}
        >
          ₹4,999 launch price. ₹9,999 after launch. No payment now.
        </p>
        <p
          style={{
            fontFamily: FONT.text,
            fontWeight: 600,
            fontSize: 32,
            color: C.white,
            margin: "24px 0 0",
            opacity: interpolate(frame, [50, 66], [0, 1], clamp),
          }}
        >
          kheelona.com
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -8,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 54,
        }}
      >
        {LINEUP.map((m, i) => (
          <Img
            key={m.img}
            src={staticFile(m.img)}
            style={{
              height: m.h,
              objectFit: "contain",
              opacity: interpolate(frame, [16 + i * 6, 30 + i * 6], [0, 1], { ...clamp, easing: easeOut }),
              translate: `0px ${interpolate(frame, [16 + i * 6, 32 + i * 6], [60, 0], { ...clamp, easing: easeBounce })}px`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const FilmTwoFriendsVeo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.cream }}>
    <Sequence durationInFrames={300}>
      <Hello />
    </Sequence>
    <Sequence from={288} durationInFrames={312}>
      <Play />
    </Sequence>
    <Sequence from={588}>
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
