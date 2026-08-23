// Kheelona brand tokens, copied 2026-07 from the old design system (deleted 2026-08-23; the
// authority is now Design/Kheelona-Design-System-v3/tokens/kheelona.css — brand hexes identical).
export const C = {
  orange: '#EF762F',
  orangeDeep: '#D85F1B',
  yellow: '#F1A23B',
  blue: '#29A0D7',
  blueSoft: '#3AA4E5',
  teal: '#1ABC9C',
  purple: '#8B5BFF',
  ink: '#272727',
  inkHead: '#1C1C1C',
  inkMuted: '#727272',
  cream: '#FFF7EE',
  cool: '#EAF6FC',
  white: '#FFFFFF',
} as const;

export const FONT = {
  display: "'Glory', system-ui, sans-serif",
  text: "'Instrument Sans', system-ui, sans-serif",
} as const;

export const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
export const EASE_BOUNCE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
