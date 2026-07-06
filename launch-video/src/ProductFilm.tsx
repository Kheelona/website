import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, EASE_BOUNCE, EASE_OUT, FONT } from "./tokens";
import { Shape } from "./shapes";
import "./fonts";

// ————————————————————————————————————————————————————————————
// ProductFilm (30fps · 600 frames · 20s) — real photoshoot cutouts.
// Every visible line is verbatim site copy (voice-lint holds here too).
//  S1   0–132  cream  Meet Lumi + hero photo
//  S2 120–264  cool   listens first, then talks back
//  S3 252–384  sun    hands: screen-free, a real conversation
//  S4 372–504  white  the three colors + 10 languages
//  S5 492–600  orange price + reserve CTA end card
// ————————————————————————————————————————————————————————————

const easeOut = Easing.bezier(...EASE_OUT);
const easeBounce = Easing.bezier(...EASE_BOUNCE);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pop = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeBounce });

const fadeUp = (frame: number, start: number, dur = 16) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut }),
  translate: `0px ${interpolate(frame, [start, start + dur], [42, 0], { ...clamp, easing: easeOut })}px`,
});

const sceneFade = (frame: number, inAt: number, outAt: number) =>
  interpolate(frame, [inAt, inAt + 12, outAt - 12, outAt], [0, 1, 1, 0], clamp);

const Pill: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-block",
        background: `${C.orange}26`,
        color: C.inkHead,
        fontFamily: FONT.text,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "16px 34px",
        borderRadius: 999,
        ...fadeUp(frame, delay),
      }}
    >
      {children}
    </div>
  );
};

// ——— S1: Meet Lumi ——————————————————————————————————————————
const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.035) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, opacity: sceneFade(frame, 0, 132) }}>
      <Shape kind="flower5" size={300} color={C.yellow} style={{ top: 80 + drift, left: 90 }} />
      <Shape kind="squircle" size={190} color={C.teal} style={{ bottom: 120 - drift, left: 420 }} />
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: -40,
          width: 640,
          height: 920,
          scale: String(pop(frame, 10, 20)),
          translate: `0px ${drift}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-8% -20%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.yellow}30 0%, transparent 68%)`,
          }}
        />
        <Img
          src={staticFile("product/8476.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 30px 40px rgba(216,95,27,0.22))" }}
        />
      </div>
      <div style={{ position: "absolute", left: 130, top: 300, maxWidth: 900 }}>
        <Pill delay={4}>For ages 3 to 6</Pill>
        <h1
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 1.02,
            color: C.inkHead,
            margin: "36px 0 0",
            ...fadeUp(frame, 12, 18),
          }}
        >
          Meet Lumi.
        </h1>
        <p
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.1,
            color: C.orangeDeep,
            margin: "26px 0 0",
            ...fadeUp(frame, 26, 18),
          }}
        >
          The friend who listens first.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ——— S2: Really talks ———————————————————————————————————————
const Listens: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [8, 30], [-140, 0], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ backgroundColor: C.cool, opacity: sceneFade(frame, 0, 144) }}>
      <Shape kind="flower13" size={230} color={C.blue} style={{ top: 90, right: 130 }} />
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: -60,
          width: 700,
          height: 1000,
          translate: `${slide}px 0px`,
          opacity: pop(frame, 6, 14),
        }}
      >
        <Img
          src={staticFile("product/8475.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 26px 36px rgba(41,160,215,0.25))" }}
        />
      </div>
      <div style={{ position: "absolute", right: 130, top: 330, maxWidth: 880, textAlign: "left" }}>
        <p
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.08,
            color: C.inkHead,
            margin: 0,
            ...fadeUp(frame, 14, 18),
          }}
        >
          Lumi is a screen-free AI robot toy that listens first, then talks back.
        </p>
        <p
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 120,
            color: C.blue,
            margin: "30px 0 0",
            ...fadeUp(frame, 46, 18),
          }}
        >
          Really talks.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ——— S3: In their hands ————————————————————————————————————
const Hands: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.04) * 8;
  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf1e2", opacity: sceneFade(frame, 0, 132) }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          width: 860,
          height: 940,
          transform: "translate(-50%, -50%)",
          scale: String(pop(frame, 8, 18)),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "6% -6%",
            borderRadius: "46% 54% 52% 48% / 48% 46% 54% 52%",
            background: C.white,
            opacity: 0.75,
          }}
        />
        <Img
          src={staticFile("product/8451.png")}
          style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain", translate: `0px ${drift}px`, filter: "drop-shadow(0 24px 34px rgba(216,95,27,0.18))" }}
        />
      </div>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          textAlign: "center",
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 92,
          color: C.inkHead,
          margin: 0,
          ...fadeUp(frame, 16, 18),
        }}
      >
        Screen-free. A real conversation.
      </p>
    </AbsoluteFill>
  );
};

// ——— S4: The family ————————————————————————————————————————
const Family: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, opacity: sceneFade(frame, 0, 132) }}>
      <Shape kind="flower5" size={220} color={C.yellow} style={{ top: 110, left: 140 }} />
      <Shape kind="flower13" size={190} color={C.blue} style={{ top: 170, right: 180 }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -30,
          width: 1500,
          height: 900,
          transform: "translateX(-50%)",
          translate: `0px ${interpolate(frame, [8, 30], [120, 0], { ...clamp, easing: easeOut })}px`,
          opacity: pop(frame, 8, 14),
        }}
      >
        <Img
          src={staticFile("product/8480.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 30px 40px rgba(28,28,28,0.16))" }}
        />
      </div>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          textAlign: "center",
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 96,
          color: C.orangeDeep,
          margin: 0,
          ...fadeUp(frame, 20, 18),
        }}
      >
        In all 10 languages you speak at home.
      </p>
    </AbsoluteFill>
  );
};

// ——— S5: The ask ———————————————————————————————————————————
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.orange, opacity: interpolate(frame, [0, 12], [0, 1], clamp) }}>
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: -20,
          width: 860,
          height: 720,
          opacity: pop(frame, 14, 16),
          translate: `0px ${interpolate(frame, [14, 34], [90, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        <Img
          src={staticFile("product/8507.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.2))" }}
        />
      </div>
      <div style={{ position: "absolute", left: 130, top: 250, maxWidth: 950 }}>
        <h2
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 118,
            lineHeight: 1.04,
            color: C.white,
            margin: 0,
            ...fadeUp(frame, 6, 16),
          }}
        >
          Reserve Lumi before the price goes up.
        </h2>
        <p
          style={{
            fontFamily: FONT.text,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.4,
            color: C.white,
            margin: "34px 0 0",
            ...fadeUp(frame, 22, 16),
          }}
        >
          ₹4,999 launch price. ₹9,999 after launch. No payment now.
        </p>
        <div
          style={{
            display: "inline-block",
            marginTop: 48,
            background: C.white,
            color: C.inkHead,
            fontFamily: FONT.text,
            fontWeight: 700,
            fontSize: 42,
            padding: "26px 56px",
            borderRadius: 999,
            boxShadow: "0 6px 10px rgba(0,0,0,0.18)",
            scale: String(pop(frame, 40, 16)),
          }}
        >
          Reserve Lumi at ₹4,999
        </div>
        <p
          style={{
            fontFamily: FONT.text,
            fontWeight: 600,
            fontSize: 34,
            color: C.white,
            margin: "44px 0 0",
            opacity: interpolate(frame, [56, 72], [0, 1], clamp),
          }}
        >
          kheelona.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const ProductFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Sequence durationInFrames={132}>
        <Hero />
      </Sequence>
      <Sequence from={120} durationInFrames={144}>
        <Listens />
      </Sequence>
      <Sequence from={252} durationInFrames={132}>
        <Hands />
      </Sequence>
      <Sequence from={372} durationInFrames={132}>
        <Family />
      </Sequence>
      <Sequence from={492}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
