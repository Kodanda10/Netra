import React from 'react'

export function useSidePanel() {
  const [open, setOpen] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const lastFocused = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKey)
      setTimeout(() => {
        const el = panelRef.current?.querySelector<HTMLElement>('[tabindex],button,a,input,select,textarea')
        el?.focus()
      }, 0)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  React.useEffect(() => {
    if (!open && lastFocused.current) lastFocused.current.focus()
  }, [open])

  return { open, setOpen, panelRef }
}

