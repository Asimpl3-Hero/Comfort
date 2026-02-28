import { useEffect } from 'react'

import { useAppSelector } from '../../../app/store/hooks.js'
import { selectThemeMode } from '../model/selectors.js'

export function ThemeModeSync() {
  const mode = useAppSelector(selectThemeMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return null
}
