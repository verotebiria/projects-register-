// ── Palette — derived from actual Projects Register branding ──────
// Icon: deep navy circle, blue folder with document lines, gold checkmark
// Splash: dark navy bg, "Projects Register" in gold/amber

export const C = {
  // Backgrounds
  bg:       '#0D1117',   // near-black navy — matches splash bg
  surface:  '#111620',   // slightly lighter surface
  card:     '#161B26',   // card background
  border:   '#1E2535',   // subtle border
  borderHi: '#2A3248',   // highlighted border

  // Brand colours from icon
  navy:     '#1C3A6E',   // deep navy from icon circle/folder
  navyLo:   'rgba(28,58,110,0.20)',
  blue:     '#2B6CB0',   // mid blue from folder
  blueLo:   'rgba(43,108,176,0.15)',
  gold:     '#F5A623',   // amber/gold from checkmark & splash text
  goldLo:   'rgba(245,166,35,0.14)',
  goldMid:  'rgba(245,166,35,0.25)',

  // Semantic
  accent:   '#F5A623',   // primary action = gold (matches brand)
  accentLo: 'rgba(245,166,35,0.12)',
  accentMid:'rgba(245,166,35,0.22)',

  // Status
  green:    '#3DD68C',
  greenLo:  'rgba(61,214,140,0.12)',
  amber:    '#F5A623',
  amberLo:  'rgba(245,166,35,0.12)',
  red:      '#E05252',
  redLo:    'rgba(224,82,82,0.12)',
  purple:   '#8B72D4',
  purpleLo: 'rgba(139,114,212,0.12)',
  purpleMid:'rgba(139,114,212,0.22)',

  // Text
  text:     '#E8EAF2',   // primary text
  textSub:  '#9BA3BF',   // secondary
  textMut:  '#4A4F63',   // muted / labels

  // Fonts
  mono:     "'JetBrains Mono', monospace",
  sans:     "'Inter', sans-serif",
} as const;

export const STATUS_COLOR: Record<string, string> = {
  Active:      C.green,
  Development: C.blue,
  Testing:     C.gold,
  Archived:    C.textMut,
};

export const STATUS_BG: Record<string, string> = {
  Active:      C.greenLo,
  Development: C.blueLo,
  Testing:     C.goldLo,
  Archived:    'rgba(74,79,99,0.12)',
};
