import { useEffect } from 'react'

import { useAppSelector } from '../../../app/hooks/index.js'
import { selectThemeMode } from '../state/index.js'

export function ThemeModeSync() {
  const mode = useAppSelector(selectThemeMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return null
}
