export const colors = {
  pageBg: '#121212',
  border: 'rgba(255,255,255,0.12)',
  inner: 'rgba(255,255,255,0.30)',
  glow: 'rgba(255,184,77,0.20)'
} as const

export const springs = {
  page: { type: 'spring', stiffness: 300, damping: 28, mass: 0.62 },
  bharat: { type: 'spring', stiffness: 520, damping: 42, mass: 0.62 },
  state: { type: 'spring', stiffness: 420, damping: 36, mass: 0.6 }
} as const

export const layoutIds = { sourcePanel: 'sourcePanel' } as const

