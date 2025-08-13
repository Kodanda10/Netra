import React from 'react'
import { Landmark, TrendingUp, Newspaper } from 'lucide-react'

type Props = {
  stateId?: string
  fallback: 'Landmark' | 'TrendingUp' | 'Newspaper'
  className?: string
}

/**
 * Attempts to render a provided state emblem from `/states/<id>.svg|png`.
 * Falls back to a Lucide icon if the asset is missing or fails to load.
 */
export const StateIcon: React.FC<Props> = ({ stateId, fallback, className }) => {
  const [src, setSrc] = React.useState<string | null>(null)
  const [errored, setErrored] = React.useState(false)

  React.useEffect(() => {
    if (!stateId) return
    // Prefer SVG, fall back to PNG automatically when SVG fails
    setSrc(`/states/${stateId}.svg`)
  }, [stateId])

  if (src && !errored) {
    return (
      <img
        src={src}
        alt=""
        className={className}
        onError={() => {
          if (src.endsWith('.svg')) {
            setSrc(`/states/${stateId}.png`)
          } else {
            setErrored(true)
          }
        }}
      />
    )
  }

  const Icon = fallback === 'Landmark' ? Landmark : fallback === 'TrendingUp' ? TrendingUp : Newspaper
  return <Icon className={className} />
}

export default StateIcon


