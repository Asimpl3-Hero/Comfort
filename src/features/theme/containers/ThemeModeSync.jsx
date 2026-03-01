import { useEffect } from 'react'

import { useAppSelector } from '../../../app/hooks/index.js'
import { selectThemeMode } from '../model/selectors.js'

export function ThemeModeSync() {
  const mode = useAppSelector(selectThemeMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return null
}
