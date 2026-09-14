import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { fr } from '@/lib/locales/fr'
import { en } from '@/lib/locales/en'
import { de } from '@/lib/locales/de'
import { es } from '@/lib/locales/es'
import { sw } from '@/lib/locales/sw'
import { ig } from '@/lib/locales/ig'
import { yo } from '@/lib/locales/yo'

export const LANGUAGES = [
 { code: 'fr', label: 'Français' },
 { code: 'en', label: 'English' },
 { code: 'de', label: 'Deutsch' },
 { code: 'es', label: 'Español' },
 { code: 'sw', label: 'Kiswahili' },
 { code: 'ig', label: 'Igbo' },
 { code: 'yo', label: 'Yorùbá' },
]

const DICTIONARIES = {
 fr,
 en,
 de,
 es,
 sw,
 ig,
 yo,
}

const LanguageContext = createContext({
 lang: 'en',
 setLang: () => {},
 t: (key, vars) => {
   return { [key]: undefined }[key]
 },
})

export function LanguageProvider({ children }) {
 const [lang, setLang] = useState(() => {
   try {
     const stored = localStorage.getItem('nelvin_lang')
     return stored && DICTIONARIES[stored] ? stored : 'en'
   } catch {
     return 'en'
   }
 })

 useEffect(() => {
   try {
     localStorage.setItem('nelvin_lang', lang)
     document.documentElement.lang = lang
   } catch {
     // storage unavailable (private mode etc.)
   }
 }, [lang])

 const value = useMemo(() => {
   const t = (key, vars) => {
     let str = DICTIONARIES[lang]?.[key] || DICTIONARIES.en[key] || key
     if (vars) {
       for (const [k, v] of Object.entries(vars)) {
         const pattern = `{${k}}`
         if (str.includes(pattern)) {
           str = str.replaceAll(pattern, String(v))
         } else {
           // tolerate locale strings that already carry a doubled brace
           str = str.replaceAll(`{${k}}}`, String(v))
         }
       }
     }
     return str
   }
   return { lang, setLang, t }
 }, [lang])

 return (
   <LanguageContext.Provider value={value}>
     {children}
   </LanguageContext.Provider>
 )
}

export function useLanguage() { return useContext(LanguageContext) }