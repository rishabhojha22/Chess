"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Logo from "@/components/logo"
import ParticleBackground from "@/components/particle-background"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useSettings } from "@/app/providers"
import { useTranslation } from "@/lib/translations"

export default function LandingPage() {
  const { language, theme } = useSettings()
  const { t } = useTranslation(language)

  return (
    <>
      <ParticleBackground />
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${theme === "light" ? "bg-gray-100/80" : "bg-neutral-900/80"} text-foreground`}
      >
        <motion.div
          className={`w-full max-w-md p-8 space-y-8 text-center backdrop-blur-sm ${theme === "light" ? "bg-white/90 border-gray-200" : "bg-neutral-900/50 border-neutral-800/50"} rounded-xl border`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Logo size={120} />
          </motion.div>
          <motion.h1
            className={`text-4xl font-bold tracking-tight ${theme === "light" ? "bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Chess Master
          </motion.h1>
          <motion.p
            className={theme === "light" ? "text-gray-700" : "text-gray-300"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("playWithStyle")}
          </motion.p>
          <motion.div className="pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button
              asChild
              className={`inline-flex items-center justify-center px-6 py-6 text-base font-medium rounded-md ${
                theme === "light"
                  ? "text-gray-800 bg-white hover:bg-gray-100 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(0,0,0,0.25)]"
                  : "text-black bg-white/90 hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(200,200,200,0.5)] hover:shadow-[0_0_25px_rgba(200,200,200,0.7)]"
              }`}
            >
              <Link href="/game">
                {t("startPlaying")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} mt-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            @Rishaab Ojha
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

