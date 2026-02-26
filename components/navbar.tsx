"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Settings, Home, DiamondIcon as ChessIcon, Github, HelpCircle, Keyboard, Info } from "lucide-react"
import { motion } from "framer-motion"
import Logo from "./logo"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import SettingsPanel from "./settings-panel"
import { useSettings } from "@/app/providers"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/translations"
import { useHotkeys } from "react-hotkeys-hook"

interface NavbarProps {
  landingPage?: boolean
}

export default function Navbar({ landingPage = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false)
  const [showPlayConfirmation, setShowPlayConfirmation] = useState(false)
  const { font, theme, language } = useSettings()
  const router = useRouter()
  const { t } = useTranslation(language)

  // Toggle the shortcuts modal with "="
  useHotkeys(
    "=",
    () => setIsShortcutsOpen((prev) => !prev),
    { description: "Toggle keyboard shortcuts" }
  );

  const navigateToHome = () => {
    router.push("/")
    setShowHomeConfirmation(false)
  }

  const navigateToGame = () => {
    router.push("/game")
    setShowPlayConfirmation(false)
  }

  return (
    <header
      className={`border-b border-neutral-800/50 bg-neutral-900/70 backdrop-blur-md sticky top-0 z-50 ${landingPage ? "absolute w-full" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between" style={{ fontFamily: font }}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setShowHomeConfirmation(true)
            }}
            className="flex items-center space-x-2 hover:no-underline"
          >
            <Logo size={32} />
            <span className={`font-bold text-xl neon-text ${theme === "light" ? "text-gray-800" : "text-white"}`}>
              Chess Game
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setShowHomeConfirmation(true)}
              className={`text-sm font-medium ${theme === "light" ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-neutral-300"} transition-colors flex items-center`}
            >
              <Home className="h-4 w-4 mr-1" />
              {t("home")}
            </button>
            <button
              onClick={() => setShowPlayConfirmation(true)}
              className={`text-sm font-medium ${theme === "light" ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-neutral-300"} transition-colors flex items-center`}
            >
              <ChessIcon className="h-4 w-4 mr-1" />
              {t("play")}
            </button>

            {/* Help Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`text-sm font-medium ${theme === "light" ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-neutral-300"} transition-colors flex items-center`}
                data-help-trigger="true"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                {t("help")}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${theme === "light" ? "bg-white border-gray-200 text-gray-800" : "bg-neutral-800 border-neutral-700 text-gray-200"}`}
              >
                <DropdownMenuItem onClick={() => setIsHelpOpen(true)} className="cursor-pointer">
                  <Info className="h-4 w-4 mr-2" />
                  {t("howToPlay")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsShortcutsOpen(true)} className="cursor-pointer">
                  <Keyboard className="h-4 w-4 mr-2" />
                  {t("keyboardShortcuts")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`text-sm font-medium ${theme === "light" ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-neutral-300"} transition-colors flex items-center`}
            >
              <Settings className="h-4 w-4 mr-1" />
              {t("settings")}
            </button>
            <a
              href="https://github.com/rishabhojha22"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium ${theme === "light" ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-neutral-300"} transition-colors flex items-center`}
            >
              <Github className="h-4 w-4 mr-1" />
              @Rishabh Ojha
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${theme === "light" ? "text-gray-800" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${theme === "light" ? "text-gray-800" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div
            className={`px-2 pt-2 pb-3 space-y-1 ${theme === "light" ? "bg-gray-100/90" : "bg-neutral-800/90"} backdrop-blur-md`}
          >
            <button
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => {
                setIsMenuOpen(false)
                setShowHomeConfirmation(true)
              }}
            >
              <Home className="h-4 w-4 mr-2" />
              {t("home")}
            </button>
            <button
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => {
                setIsMenuOpen(false)
                setShowPlayConfirmation(true)
              }}
            >
              <ChessIcon className="h-4 w-4 mr-2" />
              {t("play")}
            </button>
            <button
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => {
                setIsMenuOpen(false)
                setIsHelpOpen(true)
              }}
            >
              <Info className="h-4 w-4 mr-2" />
              {t("howToPlay")}
            </button>
            <button
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => {
                setIsMenuOpen(false)
                setIsShortcutsOpen(true)
              }}
            >
              <Keyboard className="h-4 w-4 mr-2" />
              {t("keyboardShortcuts")}
            </button>
            <button
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => {
                setIsMenuOpen(false)
                setIsSettingsOpen(true)
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("settings")}
            </button>
            <a
              href="https://github.com/rishabhojha22"
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-3 py-2 rounded-md text-base font-medium ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-neutral-700"} flex items-center`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="h-4 w-4 mr-2" />
              @Rishabh Ojha
            </a>
          </div>
        </motion.div>
      )}

      {/* Settings dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent
          className={`sm:max-w-[425px] ${theme === "light" ? "bg-white/90 text-gray-800" : "bg-neutral-800/90"} backdrop-blur-xl ${theme === "light" ? "border-gray-300" : "border-neutral-700"}`}
        >
          <DialogHeader>
            <DialogTitle className={theme === "light" ? "text-gray-800" : "text-white"}>{t("settings")}</DialogTitle>
          </DialogHeader>
          <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* How to Play dialog */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent
          className={`${theme === "light" ? "bg-white/90 text-gray-800" : "bg-neutral-800/90"} backdrop-blur-xl ${theme === "light" ? "border-gray-300" : "border-neutral-700"}`}
        >
          <DialogHeader>
            <DialogTitle className={theme === "light" ? "text-gray-800" : "text-white"}>{t("howToPlay")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <h3 className={`text-lg font-medium ${theme === "light" ? "text-gray-800" : "text-white"}`}>
              {t("gameControls")}
            </h3>
            <ul
              className={`list-disc list-inside text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"} space-y-1`}
            >
              <li>{t("clickToSelect")}</li>
              <li>{t("useZoom")}</li>
              <li>{t("flipBoard")}</li>
              <li>{t("resetAnytime")}</li>
            </ul>

            <h3 className={`text-lg font-medium ${theme === "light" ? "text-gray-800" : "text-white"}`}>
              {t("basicRules")}
            </h3>
            <ul
              className={`list-disc list-inside text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"} space-y-1`}
            >
              <li>{t("whiteFirst")}</li>
              <li>{t("goal")}</li>
              <li>{t("kingInCheck")}</li>
              <li>{t("checkmateExplain")}</li>
              <li>{t("drawConditions")}</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts dialog */}
      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent
          className={`${theme === "light" ? "bg-white/90 text-gray-800" : "bg-neutral-800/90"} backdrop-blur-xl ${theme === "light" ? "border-gray-300" : "border-neutral-700"}`}
        >
          <DialogHeader>
            <DialogTitle className={theme === "light" ? "text-gray-800" : "text-white"}>
              {t("keyboardShortcuts")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>R</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("reset")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>F</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("flip")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>Z</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("undo")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>Y</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("redo")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>H</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("hideUI")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>[</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("zoomIn")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>]</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("zoomOut")}</div>

              <div className={theme === "light" ? "text-gray-600" : "text-gray-300"}>=</div>
              <div className={theme === "light" ? "text-gray-800" : "text-gray-200"}>{t("keyboardShortcuts")}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Home Navigation Confirmation */}
      <Dialog open={showHomeConfirmation} onOpenChange={setShowHomeConfirmation}>
        <DialogContent
          className={`${theme === "light" ? "bg-white/90 text-gray-800" : "bg-neutral-800/90"} backdrop-blur-xl ${theme === "light" ? "border-gray-300" : "border-neutral-700"} confirmation-modal`}
        >
          <DialogHeader>
            <DialogTitle className={theme === "light" ? "text-gray-800" : "text-white"}>
              {t("returnToHome")}
            </DialogTitle>
            <DialogDescription className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
              {t("returnToHomeConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowHomeConfirmation(false)}
              className={
                theme === "light"
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }
            >
              {t("cancel")}
            </Button>
            <Button onClick={navigateToHome} className="bg-blue-600 hover:bg-blue-700 text-white">
              {t("continueToHome")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Play Navigation Confirmation */}
      <Dialog open={showPlayConfirmation} onOpenChange={setShowPlayConfirmation}>
        <DialogContent
          className={`${theme === "light" ? "bg-white/90 text-gray-800" : "bg-neutral-800/90"} backdrop-blur-xl ${theme === "light" ? "border-gray-300" : "border-neutral-700"} confirmation-modal`}
        >
          <DialogHeader>
            <DialogTitle className={theme === "light" ? "text-gray-800" : "text-white"}>
              {t("startNewGame")}
            </DialogTitle>
            <DialogDescription className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
              {t("startNewGameConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPlayConfirmation(false)}
              className={
                theme === "light"
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }
            >
              {t("cancel")}
            </Button>
            <Button onClick={navigateToGame} className="bg-green-600 hover:bg-green-700 text-white">
              {t("startNewGame")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}