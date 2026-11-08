import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { siteContent } from './site'
import { projects, experiments } from './projects'
import { serbianSite, serbianProjects, serbianExperiments } from './serbian'

type Language = 'en' | 'sr'
const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
}>({ language: 'en', setLanguage: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  useEffect(() => {
    document.documentElement.lang = language === 'sr' ? 'sr-Latn' : 'en'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        language === 'sr' ? serbianSite.meta.description : siteContent.meta.description,
      )
  }, [language])
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Kept beside the provider so every page reads the same language selection.
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  return {
    ...context,
    site: context.language === 'sr' ? serbianSite : siteContent,
    projects: context.language === 'sr' ? serbianProjects : projects,
    experiments: context.language === 'sr' ? serbianExperiments : experiments,
    t: (english: string, serbian: string) => (context.language === 'sr' ? serbian : english),
  }
}
