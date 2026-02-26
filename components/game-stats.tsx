"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useSettings } from "@/app/providers"
import { useTranslation } from "@/lib/translations"

interface GameStatsProps {
  turn: "w" | "b"
  moveCount: number
  inCheck: boolean
  capturedPieces: {
    w: string[]
    b: string[]
  }
}

// Revamp the game stats widget with improved styling
export default function GameStats({ turn, moveCount, inCheck, capturedPieces }: GameStatsProps) {
  const pieceSymbols: Record<string, string> = {
    p: "♙",
    n: "♘",
    b: "♗",
    r: "♖",
    q: "♕",
    k: "♔",
  }

  const { language } = useSettings()
  const { t } = useTranslation(language)

  return (
    <Card className="bg-neutral-800/90 border-neutral-700 shadow-lg backdrop-blur-sm overflow-hidden widget-card">
      <CardHeader className="pb-2 border-b border-neutral-700/50 bg-gradient-to-r from-neutral-800 to-neutral-700 widget-header">
        <CardTitle className="text-lg text-gray-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          {t("gameStats")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-neutral-700/40 to-neutral-700/20 rounded-md p-3 border border-neutral-600/30 widget-panel">
            <div className="text-xs text-gray-400 mb-1 font-medium">{t("currentTurn")}</div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  turn === "w"
                    ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    : "bg-black border border-gray-600 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                }`}
              ></div>
              <span className="font-medium text-gray-200 text-lg">{turn === "w" ? t("white") : t("black")}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-700/40 to-neutral-700/20 rounded-md p-3 border border-neutral-600/30 widget-panel">
            <div className="text-xs text-gray-400 mb-1 font-medium">{t("moveNumber")}</div>
            <div className="font-mono text-gray-200 text-lg flex items-baseline">
              {Math.floor(moveCount / 2) + 1}
              <span className="text-xs text-gray-400 ml-1">
                ({moveCount % 2 === 0 ? t("whiteToMove") : t("blackToMove")})
              </span>
            </div>
          </div>
        </div>

        {inCheck && (
          <motion.div
            className="bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-900/50 rounded-md p-3 flex items-center check-alert"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span className="font-medium text-red-200 animate-pulse">
              {t("check")} {turn === "w" ? t("white") : t("black")} {t("kingInDanger")}
            </span>
          </motion.div>
        )}

        <div className="pt-1">
          <h4 className="text-sm font-medium mb-3 text-gray-300 flex items-center border-b border-neutral-700/30 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 4v16h-12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z"></path>
              <path d="M3 8h4"></path>
              <path d="M3 12h4"></path>
              <path d="M3 16h4"></path>
            </svg>
            {t("capturedPieces")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-neutral-700/40 to-neutral-700/20 rounded-md p-3 border border-neutral-600/30 widget-panel">
              <h5 className="text-xs text-gray-400 mb-2 border-b border-neutral-600/50 pb-1 font-medium">
                {t("whiteCaptured")}:
              </h5>
              <div className="flex flex-wrap gap-1 min-h-[30px]">
                {capturedPieces.b.length > 0 ? (
                  capturedPieces.b.map((piece, i) => (
                    <motion.span
                      key={i}
                      className="text-xl text-gray-200 filter drop-shadow-glow"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {pieceSymbols[piece]}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">{t("none")}</span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-neutral-700/40 to-neutral-700/20 rounded-md p-3 border border-neutral-600/30 widget-panel">
              <h5 className="text-xs text-gray-400 mb-2 border-b border-neutral-600/50 pb-1 font-medium">
                {t("blackCaptured")}:
              </h5>
              <div className="flex flex-wrap gap-1 min-h-[30px]">
                {capturedPieces.w.length > 0 ? (
                  capturedPieces.w.map((piece, i) => (
                    <motion.span
                      key={i}
                      className="text-xl text-gray-200 filter drop-shadow-glow"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {pieceSymbols[piece]}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">{t("none")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

