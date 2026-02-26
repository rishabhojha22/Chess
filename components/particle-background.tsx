"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "react-particles"
import type { Container, Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"
import { useSettings } from "@/app/providers"

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useSettings()
  const isDarkMode =
    theme === "dark" || (theme === "system" && window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches)

  useEffect(() => {
    setMounted(true)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: do something when particles are loaded
  }, [])

  if (!mounted) return null

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="fixed inset-0 -z-10"
      options={{
        background: {
          color: {
            value: isDarkMode ? "#111111" : "#f8f8f8",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: isDarkMode ? ["#aaaaaa", "#888888", "#ffffff"] : ["#555555", "#777777", "#333333"],
          },
          links: {
            color: isDarkMode ? "#ffffff" : "#333333",
            distance: 150,
            enable: true,
            opacity: isDarkMode ? 0.2 : 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: isDarkMode ? 0.3 : 0.4,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}

