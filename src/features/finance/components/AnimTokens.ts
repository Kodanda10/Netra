export const springs = {
  page: { type: 'spring', stiffness: 300, damping: 30, mass: 0.6 },
  card: { type: 'spring', stiffness: 520, damping: 42, mass: 0.6 },
  row: { type: 'spring', stiffness: 500, damping: 34, mass: 0.5 },
} as const;

export const durations = {
  sidePanelScrim: 0.16,
  sidePanelSlide: 0.24,
  staggerState: 0.06,
  staggerRow: 0.03,
} as const;

