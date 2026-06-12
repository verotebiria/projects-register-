export const C = {
  bg:       '#0D1117',
  surface:  '#111620',
  card:     '#161B26',
  border:   '#1E2535',
  borderHi: '#2A3248',
  navyLo:   'rgba(28,58,110,0.20)',
  blue:     '#2B6CB0',
  blueLo:   'rgba(43,108,176,0.15)',
  gold:     '#F5A623',
  goldLo:   'rgba(245,166,35,0.12)',
  goldMid:  'rgba(245,166,35,0.25)',
  green:    '#3DD68C',
  greenLo:  'rgba(61,214,140,0.12)',
  red:      '#E05252',
  redLo:    'rgba(224,82,82,0.12)',
  purple:   '#8B72D4',
  purpleLo: 'rgba(139,114,212,0.12)',
  accent:   '#F5A623',
  accentLo: 'rgba(245,166,35,0.12)',
  accentMid:'rgba(245,166,35,0.25)',
  text:     '#E8EAF2',
  textSub:  '#9BA3BF',
  textMut:  '#4A4F63',
  mono:     "'JetBrains Mono', monospace",
  sans:     "'Inter', sans-serif",
} as const;

export const STATUS_COLOR: Record<string, string> = {
  Active:      '#3DD68C',
  Development: '#2B6CB0',
  Testing:     '#F5A623',
  Archived:    '#4A4F63',
};

export const STATUS_BG: Record<string, string> = {
  Active:      'rgba(61,214,140,0.12)',
  Development: 'rgba(43,108,176,0.15)',
  Testing:     'rgba(245,166,35,0.12)',
  Archived:    'rgba(74,79,99,0.12)',
};

// Consistent colour per platform index for visual variety
export const PALETTE = [
  { bg: 'rgba(91,110,245,0.13)',  border: 'rgba(91,110,245,0.30)',  text: '#7B8FF7' },
  { bg: 'rgba(245,166,35,0.13)',  border: 'rgba(245,166,35,0.30)',  text: '#F5A623' },
  { bg: 'rgba(61,214,140,0.12)',  border: 'rgba(61,214,140,0.28)',  text: '#3DD68C' },
  { bg: 'rgba(139,114,212,0.13)', border: 'rgba(139,114,212,0.30)', text: '#9B72F5' },
  { bg: 'rgba(43,108,176,0.14)',  border: 'rgba(43,108,176,0.30)',  text: '#5BA3E8' },
  { bg: 'rgba(224,82,82,0.12)',   border: 'rgba(224,82,82,0.28)',   text: '#E05252' },
  { bg: 'rgba(61,214,140,0.08)',  border: 'rgba(61,214,140,0.20)',  text: '#2ECC87' },
  { bg: 'rgba(245,100,180,0.12)', border: 'rgba(245,100,180,0.28)', text: '#F564B4' },
];
export const pal = (i: number) => PALETTE[i % PALETTE.length];
