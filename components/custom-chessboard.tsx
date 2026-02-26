"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Chess } from "chess.js"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CustomChessboardProps {
  position: string
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean
  boardOrientation?: "white" | "black"
  customBoardStyle?: React.CSSProperties
  fullscreen?: boolean
}

export default function CustomChessboard({
  position,
  onPieceDrop,
  boardOrientation = "white",
  customBoardStyle = {},
  fullscreen = false,
}: CustomChessboardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [pieces, setPieces] = useState<Record<string, { type: string; color: string }>>({})
  const [boardSize, setBoardSize] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [squareSize, setSquareSize] = useState(0)

  // Update board size on resize
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        const width = boardRef.current.offsetWidth
        setBoardSize(width)
        setSquareSize(width / 8)
      }
    }

    window.addEventListener("resize", updateSize)
    updateSize()

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Parse FEN position to get pieces
  useEffect(() => {
    try {
      // Fix for invalid FEN: ensure we have a valid FEN string
      const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      const validPosition = position || defaultFen

      // Validate FEN format
      const fenParts = validPosition.split(" ")
      const chess = new Chess(fenParts.length === 6 ? validPosition : defaultFen)

      const newPieces: Record<string, { type: string; color: string }> = {}

      // Get all pieces from the board
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const square = getSquareNotation(col, row, boardOrientation === "black")
          const piece = chess.get(square as any)
          if (piece) {
            newPieces[square] = { type: piece.type, color: piece.color }
          }
        }
      }

      setPieces(newPieces)
    } catch (error) {
      console.error("Error parsing FEN position:", error)
      // Fallback to initial position if there's an error
      try {
        const chess = new Chess()
        const newPieces: Record<string, { type: string; color: string }> = {}

        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const square = getSquareNotation(col, row, boardOrientation === "black")
            const piece = chess.get(square as any)
            if (piece) {
              newPieces[square] = { type: piece.type, color: piece.color }
            }
          }
        }

        setPieces(newPieces)
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
      }
    }
  }, [position, boardOrientation])

  // Calculate valid moves for selected piece
  useEffect(() => {
    if (selectedSquare) {
      try {
        // Ensure we have a valid FEN
        const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        const validPosition = position || defaultFen
        const fenParts = validPosition.split(" ")

        const chess = new Chess(fenParts.length === 6 ? validPosition : defaultFen)

        const moves = chess.moves({ square: selectedSquare as any, verbose: true })
        setValidMoves(moves.map((move) => move.to))
      } catch (error) {
        console.error("Error calculating valid moves:", error)
        setValidMoves([])
      }
    } else {
      setValidMoves([])
    }
  }, [selectedSquare, position])

  // Handle square click
  const handleSquareClick = (square: string) => {
    // If we already have a piece selected
    if (selectedSquare) {
      // If clicking on a valid destination square, make the move
      if (validMoves.includes(square)) {
        const moveSuccess = onPieceDrop(selectedSquare, square)
        if (moveSuccess) {
          setLastMove({ from: selectedSquare, to: square })
        }
        setSelectedSquare(null)
        setValidMoves([])
        return
      }
      // If clicking on the same square, deselect it
      else if (selectedSquare === square) {
        setSelectedSquare(null)
        setValidMoves([])
        return
      }
      // If clicking on another piece of the same color, select that piece instead
      else if (pieces[square] && getCurrentTurn(position) === pieces[square].color) {
        setSelectedSquare(square)
        return
      }
      // Otherwise, deselect the current piece
      setSelectedSquare(null)
      setValidMoves([])
    }
    // If no piece is selected yet
    else if (pieces[square]) {
      // Only allow selecting pieces of the current turn
      if (getCurrentTurn(position) === pieces[square].color) {
        setSelectedSquare(square)
      }
    }
  }

  // Helper function to get current turn from FEN
  const getCurrentTurn = (fen: string): "w" | "b" => {
    try {
      const parts = fen.split(" ")
      return parts.length > 1 ? (parts[1] as "w" | "b") : "w"
    } catch (error) {
      return "w" // Default to white if there's an error
    }
  }

  // Helper function to convert row/col to square notation (e.g., "e4")
  const getSquareNotation = (col: number, row: number, isFlipped: boolean): string => {
    if (isFlipped) {
      col = 7 - col
      row = 7 - row
    }
    const file = String.fromCharCode(97 + col) // 'a' to 'h'
    const rank = 8 - row // 1 to 8
    return `${file}${rank}`
  }

  // Render the chess piece for a square
  const renderPiece = (square: string, piece: { type: string; color: string }) => {
    const pieceKey = `${piece.color}${piece.type.toUpperCase()}`
    const pieceImage = `/images/pieces/${pieceKey}.svg`

    return (
      <div key={`${square}-${pieceKey}`} className="absolute inset-0 flex items-center justify-center z-10">
        <motion.img
          src={pieceImage || "/placeholder.svg"}
          alt={`${piece.color === "w" ? "White" : "Black"} ${getPieceName(piece.type)}`}
          className="w-[80%] h-[80%] select-none pointer-events-none"
          draggable={false}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{
            scale: 0.8,
            opacity: 0,
            y: boardOrientation === "white" ? (piece.color === "w" ? 50 : -50) : piece.color === "w" ? -50 : 50,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    )
  }

  // Get full piece name
  const getPieceName = (type: string): string => {
    switch (type) {
      case "p":
        return "Pawn"
      case "n":
        return "Knight"
      case "b":
        return "Bishop"
      case "r":
        return "Rook"
      case "q":
        return "Queen"
      case "k":
        return "King"
      default:
        return type
    }
  }

  // Generate the board squares
  const renderBoard = () => {
    const squares = []
    const isFlipped = boardOrientation === "black"

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1
        const square = getSquareNotation(col, row, isFlipped)
        const piece = pieces[square]
        const isSelected = square === selectedSquare
        const isValidMove = validMoves.includes(square)
        const isLastMoveFrom = lastMove?.from === square
        const isLastMoveTo = lastMove?.to === square

        squares.push(
          <div
            key={square}
            className={cn(
              "relative flex items-center justify-center",
              isDark ? "bg-[#769656]" : "bg-[#eeeed2]",
              isSelected && "ring-4 ring-green-500 ring-opacity-70 ring-inset",
              isLastMoveFrom && "bg-yellow-200/30",
              isLastMoveTo && "bg-yellow-400/30",
            )}
            data-square={square}
            onClick={() => handleSquareClick(square)}
          >
            {/* Coordinate labels */}
            {(col === 0 || col === 7) && (
              <span
                className={cn(
                  "absolute text-xs font-semibold",
                  isDark ? "text-[#eeeed2]" : "text-[#769656]",
                  col === 0 ? "left-1 top-1" : "right-1 bottom-1",
                )}
              >
                {col === 0 ? (isFlipped ? row + 1 : 8 - row) : ""}
                {col === 7 ? (isFlipped ? row + 1 : 8 - row) : ""}
              </span>
            )}

            {(row === 7 || row === 0) && (
              <span
                className={cn(
                  "absolute text-xs font-semibold",
                  isDark ? "text-[#eeeed2]" : "text-[#769656]",
                  row === 7 ? "left-1 bottom-1" : "right-1 top-1",
                )}
              >
                {row === 7 ? (isFlipped ? String.fromCharCode(104 - col) : String.fromCharCode(97 + col)) : ""}
                {row === 0 ? (isFlipped ? String.fromCharCode(104 - col) : String.fromCharCode(97 + col)) : ""}
              </span>
            )}

            {/* Valid move indicators */}
            {isValidMove && !piece && <div className="w-[25%] h-[25%] rounded-full bg-green-500/40 absolute"></div>}

            {isValidMove && piece && (
              <div className="w-[90%] h-[90%] rounded-full border-4 border-red-500/40 absolute"></div>
            )}

            {/* Chess piece */}
            <AnimatePresence mode="wait">{piece && renderPiece(square, piece)}</AnimatePresence>
          </div>,
        )
      }
    }

    return squares
  }

  return (
    <div
      ref={boardRef}
      className="relative rounded-lg overflow-hidden shadow-xl"
      style={{
        ...customBoardStyle,
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      <div
        className="grid grid-cols-8 grid-rows-8 h-full w-full"
        style={{
          gridTemplateRows: "repeat(8, 1fr)",
          gridTemplateColumns: "repeat(8, 1fr)",
        }}
      >
        {renderBoard()}
      </div>
    </div>
  )
}

