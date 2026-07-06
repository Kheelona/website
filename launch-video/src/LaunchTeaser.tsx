import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE_BOUNCE, EASE_OUT, FONT } from "./tokens";
import { Shape } from "./shapes";
import "./fonts";

// ————————————————————————————————————————————————————————————
// Timeline (30fps · 840 frames · 28s)
//  S1 Hook       0–210   cream, shapes, age pill, one-idea headline
//  S2 Feelings 210–510   5 color blocks × 60f (Curious…Joy)
//  S3 Product  498–660   cool wash, Lumi reveal
//  S4 Price    660–765   orange, ₹4,999 hold
//  S5 End      765–840   white, logo + CTA + wink
// ————————————————————————————————————————————————————————————

const easeOut = Easing.bezier(...EASE_OUT);
const easeBounce = Easing.bezier(...EASE_BOUNCE);

const VerticalCtx = React.createContext(false);
const useVertical = () => React.useContext(VerticalCtx);

const pop = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeBounce,
  });

const fadeUp = (frame: number, start: number, dur = 16) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  }),
  translate: `0px ${interpolate(frame, [start, start + dur], [46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  })}px`,
});

// ——— S1: Hook ————————————————————————————————————————————————
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const vertical = useVertical();
  const drift = Math.sin(frame * 0.03) * 14;

  const line1Words = "The smartest way to grow your child's brain".split(" ");
  const exit = interpolate(frame, [192, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Shape kind="flower5" size={340} color={C.yellow} style={{ top: 90 + drift, left: 110 }} />
      <Shape kind="flower13" size={260} color={C.blue} style={{ top: 620 - drift, right: 150 }} />
      <Shape kind="squircle" size={210} color={C.teal} style={{ bottom: 110 + drift, left: 320 }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 44,
          padding: 120,
          opacity: exit,
          scale: String(interpolate(frame, [192, 210], [1, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
        }}
      >
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.12em",
            color: C.orangeDeep,
            backgroundColor: "rgba(239,118,47,0.15)",
            borderRadius: 999,
            padding: "18px 42px",
            opacity: pop(frame, 10),
            scale: String(pop(frame, 10)),
          }}
        >
          FOR AGES 3 TO 6
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: vertical ? 92 : 108,
            lineHeight: 1.08,
            color: C.inkHead,
            textAlign: "center",
            maxWidth: vertical ? 940 : 1440,
          }}
        >
          {line1Words.map((w, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 26,
                opacity: interpolate(frame, [34 + i * 5, 46 + i * 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: easeOut,
                }),
                translate: `0px ${interpolate(frame, [34 + i * 5, 46 + i * 5], [40, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: easeOut,
                })}px`,
              }}
            >
              {w}
            </span>
          ))}
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: vertical ? 104 : 128,
            lineHeight: 1.05,
            textAlign: "center",
            color: C.inkHead,
            opacity: pop(frame, 118, 18),
            scale: String(interpolate(frame, [118, 140], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeBounce,
            })),
          }}
        >
          is to understand{" "}
          <span style={{ color: C.orange }}>their heart.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ——— S2: Feelings ————————————————————————————————————————————
type Feeling = {
  name: string;
  line: string;
  bg: string;
  text: string;
  img: string;
};

const FEELINGS: Feeling[] = [
  { name: "Curious", line: "Asks why. Chases ideas. Wants to know what is around the corner.", bg: C.blue, text: C.white, img: "mascot-curious.png" },
  { name: "Grumpy", line: "Has opinions. Not always wrong. Needs to be heard, not hushed.", bg: C.orange, text: C.white, img: "mascot-grumpy.png" },
  { name: "Sad", line: "Sits with you. Does not rush past. Makes space for the hard moments.", bg: C.purple, text: C.white, img: "mascot-sad.png" },
  { name: "Silly", line: "Cannot sit still. Turns everything into a game. Laughter is learning too.", bg: C.yellow, text: C.inkHead, img: "mascot-silly.png" },
  { name: "Joy", line: "Lights up. Celebrates. Reminds your child that they are wonderful.", bg: C.teal, text: C.white, img: "mascot-joy.png" },
];

const FeelingBlock: React.FC<{ f: Feeling; index: number }> = ({ f, index }) => {
  const frame = useCurrentFrame();
  const vertical = useVertical();
  const slideIn = interpolate(frame, [0, 13], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const bob = Math.sin(frame * 0.09) * 9;
  const sub = f.text === C.white ? "rgba(255,255,255,0.92)" : "#3D2A10";

  return (
    <AbsoluteFill
      style={{ backgroundColor: f.bg, translate: `${slideIn}% 0px` }}
    >
      <Shape
        kind={index % 2 === 0 ? "flower13" : "flower5"}
        size={420}
        color="#FFFFFF"
        opacity={0.12}
        style={{ top: index % 2 === 0 ? -90 : undefined, bottom: index % 2 === 0 ? undefined : -110, right: index % 2 === 0 ? -80 : undefined, left: index % 2 === 0 ? undefined : -90 }}
      />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: vertical ? 50 : 90,
          padding: vertical ? "0 90px" : "0 140px",
        }}
      >
        <div style={{ width: vertical ? 900 : 760, display: "flex", flexDirection: "column", gap: 26, textAlign: vertical ? "center" : "left" }}>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 800,
              fontSize: 176,
              lineHeight: 1,
              color: f.text,
              opacity: pop(frame, 8, 12),
              translate: `0px ${interpolate(frame, [8, 22], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeBounce })}px`,
            }}
          >
            {f.name}
          </div>
          <div
            style={{
              fontFamily: FONT.text,
              fontWeight: 550,
              fontSize: 44,
              lineHeight: 1.35,
              color: sub,
              maxWidth: 700,
              ...fadeUp(frame, 16),
            }}
          >
            {f.line}
          </div>
        </div>
        <div
          style={{
            height: vertical ? 820 : 700,
            width: vertical ? 700 : 620,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            translate: `0px ${bob}px`,
          }}
        >
          <Img
            src={staticFile(f.img)}
            style={{
              maxHeight: 640,
              maxWidth: 600,
              objectFit: "contain",
              opacity: pop(frame, 6, 10),
              scale: String(interpolate(frame, [6, 22], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeBounce })),
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.22))",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ——— S3: Product ————————————————————————————————————————————
const Product: React.FC = () => {
  const frame = useCurrentFrame();
  const vertical = useVertical();
  const slideIn = interpolate(frame, [0, 14], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const bob = Math.sin(frame * 0.06) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: C.cool, translate: `${slideIn}% 0px` }}>
      <Shape kind="flower5" size={300} color={C.blue} style={{ top: 100, right: 140 }} />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: vertical ? 60 : 110,
          padding: vertical ? "0 90px" : "0 150px",
        }}
      >
        <div style={{ width: vertical ? 900 : 820, display: "flex", flexDirection: "column", gap: 34, textAlign: vertical ? "center" : "left" }}>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 1.1,
              color: C.inkHead,
              ...fadeUp(frame, 14),
            }}
          >
            Meet Lumi. The friend who listens first.
          </div>
          <div
            style={{
              fontFamily: FONT.text,
              fontWeight: 550,
              fontSize: 46,
              color: C.inkMuted,
              ...fadeUp(frame, 26),
            }}
          >
            Screen-free. A real conversation.
          </div>
          <div
            style={{
              fontFamily: FONT.text,
              fontWeight: 650,
              fontSize: 40,
              color: C.inkHead,
              ...fadeUp(frame, 36),
            }}
          >
            In all 10 languages you speak at home.
          </div>
        </div>
        <div style={{ position: "relative", width: 620, height: 760, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              width: 620,
              height: 620,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.75)",
              scale: String(pop(frame, 6, 16)),
            }}
          />
          <Img
            src={staticFile("lumi-blue.png")}
            style={{
              position: "relative",
              maxHeight: 660,
              objectFit: "contain",
              translate: `0px ${bob}px`,
              scale: String(interpolate(frame, [10, 30], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeBounce })),
              opacity: pop(frame, 10, 10),
              filter: "drop-shadow(0 34px 44px rgba(41,160,215,0.35))",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ——— S4: Price ——————————————————————————————————————————————
const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const slideUp = interpolate(frame, [0, 14], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.orange, translate: `0px ${slideUp}%` }}>
      <Shape kind="flower13" size={460} color="#FFFFFF" opacity={0.12} style={{ top: -120, left: -110 }} />
      <Shape kind="squircle" size={300} color="#FFFFFF" opacity={0.12} style={{ bottom: -70, right: 120 }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 42,
          padding: 120,
        }}
      >
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 132,
            color: C.white,
            textAlign: "center",
            lineHeight: 1.05,
            scale: String(interpolate(frame, [10, 28], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeBounce })),
            opacity: pop(frame, 10, 12),
          }}
        >
          Reserve Lumi at ₹4,999
        </div>
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 550,
            fontSize: 46,
            color: "rgba(255,255,255,0.95)",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 1200,
            ...fadeUp(frame, 30),
          }}
        >
          ₹9,999 after launch. No payment now.
          <br />
          We hold the price, you hold your place.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ——— S5: End card ————————————————————————————————————————————
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const peek = interpolate(frame, [16, 34], [340, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeBounce,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, opacity: pop(frame, 0, 10) }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <Img
          src={staticFile("logo-wordmark-original.png")}
          style={{
            width: 640,
            objectFit: "contain",
            scale: String(pop(frame, 4, 16)),
            opacity: pop(frame, 4, 12),
          }}
        />
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 650,
            fontSize: 44,
            color: C.inkMuted,
            ...fadeUp(frame, 14),
          }}
        >
          kheelona.com
        </div>
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 700,
            fontSize: 42,
            color: C.white,
            backgroundColor: C.orange,
            borderRadius: 999,
            padding: "26px 56px",
            border: "4px solid #fff",
            boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
            scale: String(pop(frame, 22, 16)),
            opacity: pop(frame, 22, 12),
          }}
        >
          Join the pre-order list
        </div>
      </AbsoluteFill>
      <Img
        src={staticFile("mascot-hero-wink.png")}
        style={{
          position: "absolute",
          right: 70,
          bottom: -20,
          height: 460,
          translate: `0px ${peek}px`,
          filter: "drop-shadow(0 20px 30px rgba(216,95,27,0.25))",
        }}
      />
    </AbsoluteFill>
  );
};

// ——— Main ————————————————————————————————————————————————————
export const LaunchTeaser: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const { fps } = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);

  return (
    <VerticalCtx.Provider value={vertical}>
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Sequence durationInFrames={F(7)}>
        <Hook />
      </Sequence>
      {FEELINGS.map((f, i) => (
        <Sequence
          key={f.name}
          from={F(7) + i * F(2)}
          durationInFrames={F(2) + F(0.6)}
        >
          <FeelingBlock f={f} index={i} />
        </Sequence>
      ))}
      <Sequence from={F(16.6)} durationInFrames={F(5.4) + F(0.6)}>
        <Product />
      </Sequence>
      <Sequence from={F(22)} durationInFrames={F(3.5) + F(0.5)}>
        <Price />
      </Sequence>
      <Sequence from={F(25.5)}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
    </VerticalCtx.Provider>
  );
};
