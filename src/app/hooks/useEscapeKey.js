import { useEffect } from 'react'

export function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [enabled, onEscape])
}
