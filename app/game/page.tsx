"use client"

import { useState, useEffect, useRef } from "react"
import { Chess } from "chess.js"
import dynamic from "next/dynamic"
import { useToast } from "@/components/ui/use-toast"
import GameStats from "@/components/game-stats"
import MoveHistory from "@/components/move-history"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Clock, Undo2, Eye, EyeOff, Redo2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/app/providers"
import ParticleBackground from "@/components/particle-background"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Header from "@/components/header"
import { useHotkeys } from "react-hotkeys-hook"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import Footer from "@/components/footer"
import { useTranslation } from "@/lib/translations"

// Dynamically import the CustomChessboard component to avoid SSR issues
const CustomChessboard = dynamic(() => import("@/components/custom-chessboard"), {
  ssr: false,
  loading: () => <div className="w-full aspect-square bg-neutral-800 animate-pulse rounded-md"></div>,
})

export default function GamePage() {
  const [game, setGame] = useState<Chess>(new Chess())
  const [fen, setFen] = useState<string>("")
  const [orientation, setOrientation] = useState<"white" | "black">("white")
  const [moveCount, setMoveCount] = useState(0)
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] })
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const { toast } = useToast()
  const { notificationsEnabled, font, timerEnabled, language } = useSettings()
  const { t } = useTranslation(language)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hideUI, setHideUI] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  // Store move history for undo/redo functionality
  const [gameHistory, setGameHistory] = useState<Chess[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Confirmation modal states
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)

  // Track window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize game on component mount
  useEffect(() => {
    resetGame()
  }, [])

  // Update FEN when game changes
  useEffect(() => {
    if (game) {
      setFen(game.fen())
    }
  }, [game])

  const resetGame = () => {
    const newGame = new Chess()
    setGame(newGame)
    setFen(newGame.fen())
    setMoveCount(0)
    setCapturedPieces({ w: [], b: [] })
    setMoveHistory([])

    // Reset history for undo/redo
    setGameHistory([newGame])
    setHistoryIndex(0)

    // Reset timers if enabled
    if (timerEnabled) {
      setWhiteTime(600) // 10 minutes in seconds
      setBlackTime(600)
      setActiveTimer("w")
    }

    if (notificationsEnabled) {
      toast({
        title: t("newGameStarted"),
        description: t("boardReset"),
        duration: 5000, // Auto-dismiss after 5 seconds
      })
    }

    // Close confirmation dialog if open
    setShowResetConfirmation(false)
  }

  // Undo last move
  const undoLastMove = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const previousGame = gameHistory[newIndex]

      setHistoryIndex(newIndex)
      setGame(previousGame)
      setFen(previousGame.fen())
      setMoveCount(Math.max(0, moveCount - 1))

      // Update move history
      if (moveHistory.length > 0) {
        setMoveHistory(moveHistory.slice(0, -1))
      }

      // Update captured pieces
      updateCapturedPieces(previousGame)

      // Switch active timer if enabled
      if (timerEnabled) {
        setActiveTimer(previousGame.turn())
      }

      if (notificationsEnabled) {
        toast({
          title: t("moveUndone"),
          description: t("lastMoveReversed"),
          duration: 3000,
        })
      }
    } else {
      if (notificationsEnabled) {
        toast({
          title: t("cannotUndo"),
          description: t("noMovesToUndo"),
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  // Redo move
  const redoLastMove = () => {
    if (historyIndex < gameHistory.length - 1) {
      const newIndex = historyIndex + 1
      const nextGame = gameHistory[newIndex]

      setHistoryIndex(newIndex)
      setGame(nextGame)
      setFen(nextGame.fen())
      setMoveCount(moveCount + 1)

      // Update captured pieces
      updateCapturedPieces(nextGame)

      // Get the actual move notation from history
      const history = nextGame.history({ verbose: true })
      if (history.length > 0) {
        const lastMove = history[history.length - 1]
        const moveNumber = Math.floor((history.length - 1) / 2) + 1
        const isWhiteMove = (history.length - 1) % 2 === 0
        const moveNotation = `${moveNumber}${isWhiteMove ? "." : "..."} ${lastMove.san}`
        setMoveHistory([...moveHistory, moveNotation])
      }

      // Switch active timer if enabled
      if (timerEnabled) {
        setActiveTimer(nextGame.turn())
      }

      if (notificationsEnabled) {
        toast({
          title: t("moveRedone"),
          description: t("moveReapplied"),
          duration: 3000,
        })
      }
    } else {
      if (notificationsEnabled) {
        toast({
          title: t("cannotRedo"),
          description: t("noMovesToRedo"),
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  // Update captured pieces based on the current game state
  const updateCapturedPieces = (chessGame: Chess) => {
    // This is a simplified approach - in a real app, you'd track captures more precisely
    const board = chessGame.board()
    const pieceCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    }

    // Count pieces on the board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          pieceCounts[piece.color][piece.type]++
        }
      }
    }

    // Calculate captured pieces
    const captured = {
      w: [] as string[],
      b: [] as string[],
    }

    // Standard starting piece counts
    const startingCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 }

    // Add captured white pieces
    Object.entries(startingCounts).forEach(([type, count]) => {
      const missing = count - pieceCounts.w[type as keyof typeof pieceCounts.w]
      for (let i = 0; i < missing; i++) {
        captured.w.push(type)
      }
    })

    // Add captured black pieces
    Object.entries(startingCounts).forEach(([type, count]) => {
      const missing = count - pieceCounts.b[type as keyof typeof pieceCounts.b]
      for (let i = 0; i < missing; i++) {
        captured.b.push(type)
      }
    })

    setCapturedPieces(captured)
  }

  // Toggle UI visibility
  const toggleUI = () => {
    setHideUI((prev) => !prev)
    setZoom(100) // Reset zoom when toggling UI

    if (notificationsEnabled) {
      toast({
        title: hideUI ? t("uiRestored") : t("uiHidden"),
        description: hideUI ? t("gameInterfaceVisible") : t("onlyChessboardVisible"),
        duration: 3000,
      })
    }
  }

  // Handle piece movement
  const handleMove = (sourceSquare: string, targetSquare: string) => {
    try {
      // Create a copy of the current game to attempt the move
      const gameCopy = new Chess(game.fen())

      // Attempt to make the move
      const result = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
      })

      if (result) {
        // Update game state immediately
        setGame(gameCopy)
        setFen(gameCopy.fen())
        setMoveCount(moveCount + 1)

        // Update game history for undo/redo
        const newHistory = gameHistory.slice(0, historyIndex + 1)
        newHistory.push(gameCopy)
        setGameHistory(newHistory)
        setHistoryIndex(historyIndex + 1)

        // Switch active timer if enabled
        if (timerEnabled) {
          setActiveTimer(result.color === "w" ? "b" : "w")
        }

        // Update move history with proper notation
        const moveNumber = Math.floor(moveCount / 2) + 1
        const isWhiteMove = moveCount % 2 === 0
        const moveNotation = `${moveNumber}${isWhiteMove ? "." : "..."} ${result.san}`
        setMoveHistory([...moveHistory, moveNotation])

        // Update captured pieces
        updateCapturedPieces(gameCopy)

        // Check for game over conditions
        if (gameCopy.isCheckmate()) {
          if (notificationsEnabled) {
            toast({
              title: t("checkmate"),
              description: `${result.color === "w" ? t("whiteWins") : t("blackWins")}`,
              variant: "destructive",
              duration: 5000, // Auto-dismiss after 5 seconds
            })
          }
          // Stop timer on game end
          if (timerEnabled) {
            setActiveTimer(null)
          }
        } else if (gameCopy.isDraw()) {
          if (notificationsEnabled) {
            toast({
              title: t("draw"),
              description: t("gameEndedInDraw"),
              variant: "default",
              duration: 5000, // Auto-dismiss after 5 seconds
            })
          }
          // Stop timer on game end
          if (timerEnabled) {
            setActiveTimer(null)
          }
        } else if (gameCopy.isCheck()) {
          if (notificationsEnabled) {
            toast({
              title: t("check"),
              description: `${result.color === "w" ? t("blackInCheck") : t("whiteInCheck")}`,
              duration: 5000, // Auto-dismiss after 5 seconds
            })
          }
        }
        return true
      }
      return false
    } catch (error) {
      if (notificationsEnabled) {
        toast({
          title: t("invalidMove"),
          description: t("moveNotAllowed"),
          variant: "destructive",
          duration: 3000,
        })
      }
      return false
    }
  }

  // Add zoom state with fixed min/max values
  const [zoom, setZoom] = useState(100)
  const maxZoom = 150
  const minZoom = 60

  // Add zoom functions with proper constraints
  const zoomIn = () => {
    setZoom(Math.min(zoom + 10, maxZoom))
  }

  const zoomOut = () => {
    setZoom(Math.max(zoom - 10, minZoom))
  }

  // Add pause timer functionality and fix board flipping scroll position
  // First, add state for paused timer
  const [timerPaused, setTimerPaused] = useState(false)

  // Modify the flipBoard function to preserve scroll position
  const flipBoard = () => {
    // Save current scroll position
    const scrollPosition = window.scrollY

    // Set orientation without animation first
    setOrientation(orientation === "white" ? "black" : "white")

    // Immediately restore scroll position
    window.scrollTo(0, scrollPosition)

    // Add a second scroll restoration after a short delay to ensure it works
    setTimeout(() => {
      window.scrollTo(0, scrollPosition)
    }, 50)

    if (notificationsEnabled) {
      toast({
        title: t("boardFlipped"),
        description: t("viewingFrom").replace("{color}", orientation === "white" ? t("black") : t("white")),
        duration: 3000,
      })
    }
  }

  // Timer functionality
  const [whiteTime, setWhiteTime] = useState(600) // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600)
  const [activeTimer, setActiveTimer] = useState<"w" | "b" | null>("w") // White starts

  // Add a function to toggle timer pause
  const toggleTimerPause = () => {
    setTimerPaused(!timerPaused)
    if (notificationsEnabled) {
      toast({
        title: timerPaused ? "Timer Resumed" : "Timer Paused",
        description: timerPaused ? "The game timer has been resumed." : "The game timer has been paused.",
        duration: 3000,
      })
    }
  }

  // Add a function to reset the timer
  const resetTimer = () => {
    setWhiteTime(600) // 10 minutes in seconds
    setBlackTime(600)
    setActiveTimer("w") // White starts
    setTimerPaused(false)
    if (notificationsEnabled) {
      toast({
        title: "Timer Reset",
        description: "The game timer has been reset to 10 minutes.",
        duration: 3000,
      })
    }
  }

  // Update the timer effect to respect the paused state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerEnabled && activeTimer && !timerPaused) {
      interval = setInterval(() => {
        if (activeTimer === "w") {
          setWhiteTime((prev) => {
            if (prev <= 0) {
              clearInterval(interval!)
              if (notificationsEnabled) {
                toast({
                  title: t("timeUp"),
                  description: t("whiteTimeUp"),
                  variant: "destructive",
                  duration: 5000,
                })
              }
              setActiveTimer(null)
              return 0
            }
            return prev - 1
          })
        } else {
          setBlackTime((prev) => {
            if (prev <= 0) {
              clearInterval(interval!)
              if (notificationsEnabled) {
                toast({
                  title: t("timeUp"),
                  description: t("blackTimeUp"),
                  variant: "destructive",
                  duration: 5000,
                })
              }
              setActiveTimer(null)
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerEnabled, activeTimer, timerPaused, notificationsEnabled, toast, t])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate board size based on UI state
  const getBoardSize = () => {
    if (hideUI) {
      // When UI is hidden, calculate size based on viewport
      const minDimension = Math.min(windowSize.width * 0.8, windowSize.height * 0.8)
      return {
        width: minDimension,
        height: minDimension,
        transform: "none", // Override any zoom transform
        marginTop: "0px", // Reduced margin for the turn indicator
      }
    } else {
      // When UI is visible, use 80% of the original size (20% smaller)
      return {
        width: "80%",
        maxWidth: "800px",
        transform: `scale(${zoom / 100})`,
        transformOrigin: "top left",
      }
    }
  }

  // Keyboard shortcuts
  useHotkeys("r", () => setShowResetConfirmation(true), { description: "Reset game" })
  useHotkeys("f", flipBoard, { description: "Flip board" })
  useHotkeys("z", undoLastMove, { description: "Undo last move" })
  useHotkeys("y", redoLastMove, { description: "Redo last move" })
  useHotkeys("h", toggleUI, { description: "Hide/show UI" })
  useHotkeys("[", zoomIn, { description: "Zoom in" })
  useHotkeys("]", zoomOut, { description: "Zoom out" })

  // Calculate board container styles
  const boardContainerStyle = getBoardSize()

  return (
    <div className={hideUI ? "fullscreen-mode" : ""}>
      <ParticleBackground />

      <AnimatePresence>
        {!hideUI && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Header />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`game-container ${hideUI ? "flex flex-col justify-center items-center min-h-screen" : "container mx-auto px-4 py-8"}`}
        style={{ fontFamily: `var(--${font})` }}
      >
        <AnimatePresence mode="wait">
          {hideUI ? (
            <motion.div
              key="fullscreen-board"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="board-wrapper flex flex-col justify-center items-center"
            >
              {/* Turn indicator above the board in fullscreen mode */}
              <motion.div
                className="turn-indicator-container mb-2" // Reduced margin bottom
                style={{
                  width: boardContainerStyle.width || "100%",
                  maxWidth: boardContainerStyle.maxWidth || "800px",
                  margin: "0 auto 0.5rem auto", // Reduced margin
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center py-2 px-5 rounded-md bg-neutral-800/90 border border-neutral-700/50 backdrop-blur-sm shadow-md">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${
                      game.turn() === "w"
                        ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        : "bg-black border border-gray-600 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    }`}
                  ></div>
                  <span className="font-medium text-gray-200 text-lg">
                    {game.turn() === "w" ? t("whitesTurn") : t("blacksTurn")}
                  </span>
                  {orientation.charAt(0).toLowerCase() !== game.turn() && (
                    <span className="ml-3 text-sm text-gray-400">{t("waitingForOpponent")}</span>
                  )}
                </div>
              </motion.div>

              <div
                ref={containerRef}
                className="chess-board-container bg-neutral-800/80 backdrop-blur-sm p-4 border border-neutral-700/50"
                style={boardContainerStyle}
              >
                <CustomChessboard
                  position={fen}
                  onPieceDrop={(sourceSquare, targetSquare) => handleMove(sourceSquare, targetSquare)}
                  boardOrientation={orientation}
                  customBoardStyle={{
                    transition: "all 0.3s ease",
                  }}
                  fullscreen={true}
                />
              </div>

              <div className="absolute top-4 right-4 flex space-x-2 z-[1000]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={toggleUI}
                        variant="outline"
                        size="sm"
                        className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("showUI")} (H key)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="normal-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Turn indicator above the board - positioned outside with proper spacing */}
                  <motion.div
                    className="turn-indicator-container mb-6"
                    style={{
                      width: boardContainerStyle.width || "100%",
                      maxWidth: boardContainerStyle.maxWidth || "800px",
                      margin: "0 auto 1.5rem auto",
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center py-3 px-5 rounded-md bg-neutral-800/90 border border-neutral-700/50 backdrop-blur-sm shadow-md">
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${
                          game.turn() === "w"
                            ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            : "bg-black border border-gray-600 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        }`}
                      ></div>
                      <span className="font-medium text-gray-200 text-lg">
                        {game.turn() === "w" ? t("whitesTurn") : t("blacksTurn")}
                      </span>
                      {orientation.charAt(0).toLowerCase() !== game.turn() && (
                        <span className="ml-3 text-sm text-gray-400">{t("waitingForOpponent")}</span>
                      )}
                    </div>
                  </motion.div>

                  <div
                    ref={containerRef}
                    className="chess-board-container bg-neutral-800/80 backdrop-blur-sm p-4 border border-neutral-700/50"
                    style={boardContainerStyle}
                  >
                    <CustomChessboard
                      position={fen}
                      onPieceDrop={(sourceSquare, targetSquare) => handleMove(sourceSquare, targetSquare)}
                      boardOrientation={orientation}
                      customBoardStyle={{
                        transition: "all 0.3s ease",
                      }}
                      fullscreen={false}
                    />
                  </div>

                  <div className="flex justify-between mt-4 space-x-3">
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={zoomOut}
                              variant="outline"
                              size="sm"
                              className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                              aria-label="Zoom out"
                            >
                              <ZoomOut className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("zoomOut")} (- key)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={zoomIn}
                              variant="outline"
                              size="sm"
                              className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                              aria-label="Zoom in"
                            >
                              <ZoomIn className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("zoomIn")} (+ key)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <span className="flex items-center justify-center px-2 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-md text-xs text-gray-200 min-w-[50px] zoom-indicator">
                        {zoom}%
                      </span>
                    </div>

                    <div className="flex space-x-2 flex-1 justify-end">
                      <Button
                        onClick={() => setShowResetConfirmation(true)}
                        variant="outline"
                        size="sm"
                        className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        {t("reset")}
                      </Button>

                      <Button
                        onClick={undoLastMove}
                        variant="outline"
                        size="sm"
                        className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                        disabled={historyIndex <= 0}
                      >
                        <Undo2 className="mr-1 h-3.5 w-3.5" />
                        {t("undo")}
                      </Button>

                      <Button
                        onClick={redoLastMove}
                        variant="outline"
                        size="sm"
                        className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                        disabled={historyIndex >= gameHistory.length - 1}
                      >
                        <Redo2 className="mr-1 h-3.5 w-3.5" />
                        {t("redo")}
                      </Button>

                      <Button
                        onClick={flipBoard}
                        variant="outline"
                        size="sm"
                        className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                      >
                        {t("flip")}
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={toggleUI}
                              variant="outline"
                              size="sm"
                              className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 control-button"
                            >
                              <EyeOff className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("hideUI")} (H key)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <GameStats
                    turn={game.turn()}
                    moveCount={moveCount}
                    inCheck={game.isCheck()}
                    capturedPieces={capturedPieces}
                  />

                  <MoveHistory moves={moveHistory} />

                  <div className="glass-panel rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-200 flex items-center">
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
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      {t("gameAnalysis")}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">{t("positionEvaluation")}</h4>
                        <div className="h-2 bg-neutral-700 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-in-out ${
                              game.turn() === "w"
                                ? "bg-gradient-to-r from-gray-300 to-white"
                                : "bg-gradient-to-l from-gray-800 to-black"
                            }`}
                            style={{
                              width: `${
                                // Calculate position based on material advantage
                                (() => {
                                  let whiteMaterial = 0
                                  let blackMaterial = 0

                                  // Count captured pieces value
                                  capturedPieces.w.forEach((piece) => {
                                    switch (piece) {
                                      case "p":
                                        blackMaterial += 1
                                        break
                                      case "n":
                                        blackMaterial += 3
                                        break
                                      case "b":
                                        blackMaterial += 3
                                        break
                                      case "r":
                                        blackMaterial += 5
                                        break
                                      case "q":
                                        blackMaterial += 9
                                        break
                                    }
                                  })

                                  capturedPieces.b.forEach((piece) => {
                                    switch (piece) {
                                      case "p":
                                        whiteMaterial += 1
                                        break
                                      case "n":
                                        whiteMaterial += 3
                                        break
                                      case "b":
                                        whiteMaterial += 3
                                        break
                                      case "r":
                                        whiteMaterial += 5
                                        break
                                      case "q":
                                        whiteMaterial += 9
                                        break
                                    }
                                  })

                                  // Calculate advantage percentage (50% is even)
                                  const advantage = whiteMaterial - blackMaterial
                                  const maxAdvantage = 15 // Maximum material difference to show
                                  const percentage = 50 + (advantage / maxAdvantage) * 50

                                  // Clamp between 10% and 90% to always show some bar
                                  return Math.max(10, Math.min(90, percentage))
                                })()
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{t("black")}</span>
                          <span>{t("even")}</span>
                          <span>{t("white")}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-300">{t("gamePhase")}</h4>
                        <div className="mt-1 flex items-center">
                          <div
                            className={`h-1.5 flex-1 ${moveCount < 10 ? "bg-green-500/70" : "bg-neutral-600/50"} rounded-l-full`}
                          ></div>
                          <div
                            className={`h-1.5 flex-1 ${moveCount >= 10 && moveCount < 30 ? "bg-yellow-500/70" : "bg-neutral-600/50"} rounded-md`}
                          ></div>
                          <div
                            className={`h-1.5 flex-1 ${moveCount >= 30 ? "bg-red-500/70" : "bg-neutral-600/50"} rounded-r-full`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span className={moveCount < 10 ? "text-green-400" : "text-gray-500"}>{t("opening")}</span>
                          <span className={moveCount >= 10 && moveCount < 30 ? "text-yellow-400" : "text-gray-500"}>
                            {t("middleGame")}
                          </span>
                          <span className={moveCount >= 30 ? "text-red-400" : "text-gray-500"}>{t("endGame")}</span>
                        </div>
                      </div>

                      {timerEnabled && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {t("timeControl")}
                          </h4>
                          <div className="flex justify-between mt-1">
                            <div
                              className={`text-center p-1.5 rounded ${activeTimer === "w" ? "bg-gradient-to-r from-neutral-700/80 to-neutral-700/50" : ""}`}
                            >
                              <div className="text-xs text-gray-400">{t("white")}</div>
                              <div
                                className={`font-mono text-sm ${whiteTime < 60 ? "text-red-400 animate-pulse" : "text-gray-200"}`}
                              >
                                {formatTime(whiteTime)}
                              </div>
                            </div>
                            <div
                              className={`text-center p-1.5 rounded ${activeTimer === "b" ? "bg-gradient-to-r from-neutral-700/80 to-neutral-700/50" : ""}`}
                            >
                              <div className="text-xs text-gray-400">{t("black")}</div>
                              <div
                                className={`font-mono text-sm ${blackTime < 60 ? "text-red-400 animate-pulse" : "text-gray-200"}`}
                              >
                                {formatTime(blackTime)}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 space-x-2">
                            <Button
                              onClick={toggleTimerPause}
                              variant="outline"
                              size="sm"
                              className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 flex-1"
                            >
                              {timerPaused ? "Resume" : "Pause"}
                            </Button>
                            <Button
                              onClick={resetTimer}
                              variant="outline"
                              size="sm"
                              className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 hover:bg-neutral-700 text-gray-200 flex-1"
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <DialogContent className="bg-neutral-800/90 backdrop-blur-xl border-neutral-700 text-white confirmation-modal">
          <DialogHeader>
            <DialogTitle>{t("resetGame")}</DialogTitle>
            <DialogDescription className="text-gray-300">{t("resetGameConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirmation(false)}
              className="bg-neutral-700 hover:bg-neutral-600"
            >
              {t("cancel")}
            </Button>
            <Button onClick={resetGame} className="bg-red-600 hover:bg-red-700">
              {t("resetGame")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!hideUI && <Footer />}
    </div>
  )
}

