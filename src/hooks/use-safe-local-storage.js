import { useState, useEffect, useCallback } from "react"

export function useSafeLocalStorage(key, defaultValue) {
  const [state, setState] = useState(defaultValue)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) setState(JSON.parse(stored))
    } catch (e) {}
  }, [key])

  const setValue = useCallback(
    valueOrUpdater => {
      setState(prev => {
        const next =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prev)
            : valueOrUpdater
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch (e) {}
        return next
      })
    },
    [key],
  )

  const removeItem = useCallback(() => {
    setState(defaultValue)
    try {
      window.localStorage.removeItem(key)
    } catch (e) {}
  }, [key, defaultValue])

  return [state, setValue, { removeItem }]
}
