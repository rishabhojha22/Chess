"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { useSettings } from "@/app/providers"
import { useTranslation } from "@/lib/translations"

interface MoveHistoryProps {
  moves: string[]
}

// Revamp the move history with a table format for white and black moves
export default function MoveHistory({ moves }: MoveHistoryProps) {
  const { language } = useSettings()
  const { t } = useTranslation(language)

  // Process moves to pair white and black moves
  const processedMoves = () => {
    const result = []
    let currentPair = { number: 1, white: null, black: null }

    moves.forEach((move, index) => {
      // Extract move number and notation
      const parts = move.split(" ")
      const moveNumber = parts[0].replace(".", "").replace("...", "")
      const notation = parts.slice(1).join(" ")

      // Determine if it's a white or black move
      const isWhiteMove = !move.includes("...")

      if (isWhiteMove) {
        // Start a new pair for white move
        if (currentPair.white !== null) {
          result.push(currentPair)
          currentPair = { number: Number.parseInt(moveNumber), white: notation, black: null }
        } else {
          currentPair.number = Number.parseInt(moveNumber)
          currentPair.white = notation
        }
      } else {
        // Add black move to current pair
        currentPair.black = notation
        // Push the completed pair
        result.push(currentPair)
        currentPair = { number: Number.parseInt(moveNumber) + 1, white: null, black: null }
      }
    })

    // Add the last pair if it has any moves
    if (currentPair.white !== null || currentPair.black !== null) {
      result.push(currentPair)
    }

    return result
  }

  const moveHistory = processedMoves()

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
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          {t("moveHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <ScrollArea className="h-[180px] pr-4">
          {moves.length > 0 ? (
            <div className="space-y-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-700/30">
                    <th className="pb-2 text-xs font-medium text-gray-400 w-12 text-center">#</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">{t("white")}</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">{t("black")}</th>
                  </tr>
                </thead>
                <tbody>
                  {moveHistory.map((pair, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-neutral-700/30 transition-colors table-row"
                    >
                      <td className="py-1.5 px-1 text-xs font-mono text-gray-400 text-center border-r border-neutral-700/20">
                        {pair.number}
                      </td>
                      <td
                        className={`py-1.5 px-2 text-xs font-mono font-medium ${pair.white ? "text-gray-200" : "text-gray-500"} border-r border-neutral-700/20`}
                      >
                        {pair.white || "-"}
                      </td>
                      <td
                        className={`py-1.5 px-2 text-xs font-mono font-medium ${pair.black ? "text-gray-200" : "text-gray-500"}`}
                      >
                        {pair.black || "-"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2 opacity-30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {t("noMoves")}
              <p className="mt-1 text-gray-600">{t("makeFirstMove")}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

