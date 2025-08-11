import React from 'react'

export const RiveIcon: React.FC<{ src: string; artboard?: string; stateMachine?: string; active?: boolean; newItems?: boolean; reducedMotion?: boolean }>
  = ({ src, artboard, stateMachine }) => {
  const [Comp, setComp] = React.useState<any>(null)
  React.useEffect(() => { import('@rive-app/react-canvas').then(m => setComp(() => m.RiveComponent)).catch(() => {}) }, [])
  if (!Comp) return null
  return (
    <Comp src={src} artboard={artboard} stateMachines={stateMachine ? [stateMachine] : undefined} autoplay />
  )
}

