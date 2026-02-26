"use client"

import { useState, useEffect, useCallback } from "react"

interface CursorState {
  isVisible: boolean
  image: string | null
  x: number
  y: number
}

export function useCursor() {
  const [cursor, setCursorState] = useState<CursorState>({
    isVisible: false,
    image: null,
    x: 0,
    y: 0,
  })

  // Create a custom cursor element if it doesn't exist
  useEffect(() => {
    let cursorElement = document.getElementById("custom-chess-cursor")

    if (!cursorElement) {
      cursorElement = document.createElement("div")
      cursorElement.id = "custom-chess-cursor"
      cursorElement.style.position = "fixed"
      cursorElement.style.pointerEvents = "none"
      cursorElement.style.zIndex = "9999"
      cursorElement.style.width = "60px"
      cursorElement.style.height = "60px"
      cursorElement.style.backgroundSize = "contain"
      cursorElement.style.backgroundRepeat = "no-repeat"
      cursorElement.style.backgroundPosition = "center"
      cursorElement.style.transform = "translate(-50%, -50%)"
      cursorElement.style.filter = "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))"
      cursorElement.style.display = "none"
      cursorElement.style.willChange = "transform"
      document.body.appendChild(cursorElement)
    }

    return () => {
      if (cursorElement && document.body.contains(cursorElement)) {
        document.body.removeChild(cursorElement)
      }
    }
  }, [])

  // Update cursor position on mouse move with optimized performance
  useEffect(() => {
    let requestId: number | null = null
    let mouseX = 0
    let mouseY = 0

    const updateCursorPosition = () => {
      const cursorElement = document.getElementById("custom-chess-cursor")

      if (cursorElement) {
        cursorElement.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }

      requestId = null
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!requestId) {
        requestId = requestAnimationFrame(updateCursorPosition)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [])

  // Set cursor image and visibility with improved animation
  useEffect(() => {
    const cursorElement = document.getElementById("custom-chess-cursor")

    if (cursorElement) {
      if (cursor.isVisible && cursor.image) {
        // Add a smooth entry animation
        cursorElement.style.opacity = "0"
        cursorElement.style.backgroundImage = `url(${cursor.image})`
        cursorElement.style.display = "block"
        document.body.style.cursor = "none"

        // Ensure smoother transition with proper timing
        setTimeout(() => {
          if (cursorElement) {
            cursorElement.style.transition = "opacity 0.15s ease-out"
            cursorElement.style.opacity = "1"
          }
        }, 10)
      } else {
        cursorElement.style.transition = "opacity 0.15s ease-in"
        cursorElement.style.opacity = "0"

        // Remove element after fade
        setTimeout(() => {
          if (cursorElement) {
            cursorElement.style.display = "none"
            document.body.style.cursor = ""
          }
        }, 150)
      }
    }
  }, [cursor])

  // Set cursor image with improvements
  const setCursor = useCallback((image: string) => {
    setCursorState({
      isVisible: true,
      image,
      x: 0,
      y: 0,
    })
  }, [])

  // Reset cursor to default with proper cleanup
  const resetCursor = useCallback(() => {
    setCursorState({
      isVisible: false,
      image: null,
      x: 0,
      y: 0,
    })
  }, [])

  return { setCursor, resetCursor }
}

