"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings } from "@/app/providers"
import { Clock, Globe } from "lucide-react"
import { availableLanguages, useTranslation } from "@/lib/translations"

interface SettingsPanelProps {
  onClose?: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { toast } = useToast()
  const {
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
  } = useSettings()

  const { t } = useTranslation(language)

  // Local state for the form
  const [localFont, setLocalFont] = useState(font)
  const [localNotifications, setLocalNotifications] = useState(notificationsEnabled)
  const [localTheme, setLocalTheme] = useState(theme)
  const [localTimerEnabled, setLocalTimerEnabled] = useState(timerEnabled)
  const [localLanguage, setLocalLanguage] = useState(language)

  // Update local state when context changes
  useEffect(() => {
    setLocalFont(font)
    setLocalNotifications(notificationsEnabled)
    setLocalTheme(theme)
    setLocalTimerEnabled(timerEnabled)
    setLocalLanguage(language)
  }, [font, notificationsEnabled, theme, timerEnabled, language])

  const handleSaveSettings = () => {
    // Update context with local values
    setFont(localFont)
    setNotificationsEnabled(localNotifications)
    setTheme(localTheme)
    setTimerEnabled(localTimerEnabled)
    setLanguage(localLanguage)

    // Save to localStorage via context
    saveSettings()

    toast({
      title: t("settingsSaved"),
      description: t("preferencesUpdated"),
    })

    if (onClose) {
      onClose()
    }
  }

  // Get font family for preview
  const getFontFamily = (fontName: string): string => {
    switch (fontName) {
      case "inter":
        return "var(--font-inter)"
      case "roboto":
        return "var(--font-roboto)"
      case "montserrat":
        return "var(--font-montserrat)"
      case "opensans":
        return "var(--font-opensans)"
      case "poppins":
        return "var(--font-poppins)"
      default:
        return "var(--font-inter)"
    }
  }

  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className={`grid grid-cols-3 mb-4 ${theme === "light" ? "bg-gray-200" : "bg-neutral-700"}`}>
        <TabsTrigger
          value="appearance"
          className={`${
            theme === "light"
              ? "data-[state=active]:bg-gray-300 text-gray-800"
              : "data-[state=active]:bg-neutral-600 text-white"
          }`}
        >
          {t("appearance")}
        </TabsTrigger>
        <TabsTrigger
          value="game"
          className={`${
            theme === "light"
              ? "data-[state=active]:bg-gray-300 text-gray-800"
              : "data-[state=active]:bg-neutral-600 text-white"
          }`}
        >
          {t("game")}
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className={`${
            theme === "light"
              ? "data-[state=active]:bg-gray-300 text-gray-800"
              : "data-[state=active]:bg-neutral-600 text-white"
          }`}
        >
          {t("notifications")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="font-select" className="text-gray-800 dark:text-gray-300">
              {t("fontFamily")}
            </Label>
            <Select value={localFont} onValueChange={setLocalFont}>
              <SelectTrigger
                id="font-select"
                className="bg-neutral-700 border-neutral-600 dark:bg-neutral-700 dark:border-neutral-600 light:bg-white light:border-gray-300 light:text-gray-800"
              >
                <SelectValue placeholder={t("selectFont")} />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 dark:bg-neutral-700 dark:border-neutral-600 light:bg-white light:border-gray-300 light:text-gray-800">
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="opensans">Open Sans</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-800 dark:text-gray-300">{t("theme")}</Label>
            <RadioGroup value={localTheme} onValueChange={setLocalTheme} className="flex flex-col space-y-1 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="border-neutral-500 dark:border-neutral-500 light:border-gray-400"
                />
                <Label htmlFor="dark" className="cursor-pointer text-gray-800 dark:text-gray-300">
                  {t("dark")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="light"
                  id="light"
                  className="border-neutral-500 dark:border-neutral-500 light:border-gray-400"
                />
                <Label htmlFor="light" className="cursor-pointer text-gray-800 dark:text-gray-300">
                  {t("light")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="system"
                  id="system"
                  className="border-neutral-500 dark:border-neutral-500 light:border-gray-400"
                />
                <Label htmlFor="system" className="cursor-pointer text-gray-800 dark:text-gray-300">
                  {t("system")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="language-select" className="flex items-center text-gray-800 dark:text-gray-300">
              <Globe className="h-4 w-4 mr-1" />
              {t("language")}
            </Label>
            <Select value={localLanguage} onValueChange={setLocalLanguage}>
              <SelectTrigger
                id="language-select"
                className="bg-neutral-700 border-neutral-600 dark:bg-neutral-700 dark:border-neutral-600 light:bg-white light:border-gray-300 light:text-gray-800 mt-2"
              >
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 dark:bg-neutral-700 dark:border-neutral-600 light:bg-white light:border-gray-300 light:text-gray-800">
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="game" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="timer" className="flex items-center text-gray-800 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-1" />
                {t("gameTimer")}
              </Label>
              <p className="text-sm text-gray-600 dark:text-neutral-400 light:text-gray-600">{t("enableTimer")}</p>
            </div>
            <Switch id="timer" checked={localTimerEnabled} onCheckedChange={setLocalTimerEnabled} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-gray-800 dark:text-gray-300">
                {t("gameNotifications")}
              </Label>
              <p className="text-sm text-gray-600 dark:text-neutral-400 light:text-gray-600">
                {t("receiveNotifications")}
              </p>
            </div>
            <Switch id="notifications" checked={localNotifications} onCheckedChange={setLocalNotifications} />
          </div>
        </div>
      </TabsContent>

      <div className="mt-6 border-t border-neutral-700 dark:border-neutral-700 light:border-gray-300 pt-6">
        <h3 className="text-sm font-medium mb-3 text-gray-800 dark:text-gray-300">{t("preview")}</h3>
        <motion.div
          className="p-4 rounded-md border border-neutral-700 dark:border-neutral-700 light:border-gray-300 dark:bg-neutral-900 light:bg-gray-100"
          style={{ fontFamily: getFontFamily(localFont) }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-bold mb-2 text-gray-800 dark:text-white light:text-gray-800">
            {t("sampleText")}
          </h4>
          <p className="text-sm text-gray-600 dark:text-neutral-300 light:text-gray-600">{t("textAppearance")}</p>
          <div className="mt-3 flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${localNotifications ? "bg-green-500" : "bg-neutral-500"}`}></div>
            <span className="text-xs text-gray-700 dark:text-gray-300 light:text-gray-700">
              {t("notificationsStatus")}: {localNotifications ? t("enabled") : t("disabled")}
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${localTimerEnabled ? "bg-green-500" : "bg-neutral-500"}`}></div>
            <span className="text-xs text-gray-700 dark:text-gray-300 light:text-gray-700">
              {t("timerStatus")}: {localTimerEnabled ? t("enabled") : t("disabled")}
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300 light:text-gray-700">
              {t("language")}: {availableLanguages.find((l) => l.code === localLanguage)?.name || "English"}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div className="mt-6 flex justify-end" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          {t("saveSettings")}
        </Button>
      </motion.div>
    </Tabs>
  )
}

