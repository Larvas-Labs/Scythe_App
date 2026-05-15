import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations, LANGUAGES } from './translations.js'

const LangContext = createContext(null)

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`))
}

export function LangProvider({ children, initialLang = 'en' }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    setLang(initialLang)
  }, [initialLang])

  const t = useCallback((key, vars) => {
    const dict = translations[lang] || translations['en']
    const fallback = translations['en']
    const str = dict[key] ?? fallback[key] ?? key
    return interpolate(str, vars)
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
