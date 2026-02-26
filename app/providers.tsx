"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface SettingsContextType {
  font: string
  setFont: (font: string) => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  theme: string
  setTheme: (theme: string) => void
  timerEnabled: boolean
  setTimerEnabled: (enabled: boolean) => void
  language: string
  setLanguage: (language: string) => void
  saveSettings: () => void
}

const SettingsContext = createContext<SettingsContextType>({
  font: "poppins",
  setFont: () => {},
  notificationsEnabled: true,
  setNotificationsEnabled: () => {},
  theme: "dark",
  setTheme: () => {},
  timerEnabled: false,
  setTimerEnabled: () => {},
  language: "en",
  setLanguage: () => {},
  saveSettings: () => {},
})

export const useSettings = () => useContext(SettingsContext)

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize with default values, but will be overridden by localStorage if available
  const [font, setFont] = useState("poppins")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [theme, setTheme] = useState("dark")
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [language, setLanguage] = useState("en")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const storedFont = localStorage.getItem("chess-app-font")
    const storedNotifications = localStorage.getItem("chess-app-notifications")
    const storedTheme = localStorage.getItem("chess-app-theme")
    const storedTimer = localStorage.getItem("chess-app-timer")
    const storedLanguage = localStorage.getItem("chess-app-language")

    if (storedFont) setFont(storedFont)
    if (storedNotifications) setNotificationsEnabled(storedNotifications === "true")
    if (storedTheme) setTheme(storedTheme)
    if (storedTimer) setTimerEnabled(storedTimer === "true")
    if (storedLanguage) setLanguage(storedLanguage)

    setIsLoaded(true)
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("chess-app-font", font)
    localStorage.setItem("chess-app-notifications", String(notificationsEnabled))
    localStorage.setItem("chess-app-theme", theme)
    localStorage.setItem("chess-app-timer", String(timerEnabled))
    localStorage.setItem("chess-app-language", language)

    // Apply font to document
    document.documentElement.style.setProperty("--font-family", getFontFamily(font))

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else if (theme === "light") {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
      } else {
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")
      }
    }
  }

  // Apply settings on initial load and when they change
  useEffect(() => {
    if (isLoaded) {
      saveSettings()
    }
  }, [font, notificationsEnabled, theme, timerEnabled, language, isLoaded])

  return (
    <SettingsContext.Provider
      value={{
        font,
        setFont,
        notificationsEnabled,
        setNotificationsEnabled,
        theme,
        setTheme,
        timerEnabled,
        setTimerEnabled,
        language,
        setLanguage,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// Helper function to get the actual font family CSS value
function getFontFamily(fontName: string): string {
  switch (fontName) {
    case "inter":
      return "Inter, sans-serif"
    case "roboto":
      return "Roboto, sans-serif"
    case "montserrat":
      return "Montserrat, sans-serif"
    case "opensans":
      return "Open Sans, sans-serif"
    case "poppins":
      return "Poppins, sans-serif"
    default:
      return "Poppins, sans-serif"
  }
}

