"use client"

import { motion } from "framer-motion"
import { Github, Heart } from "lucide-react"
import { useSettings } from "@/app/providers"
import { useTranslation } from "@/lib/translations"

export default function Footer() {
  const { language } = useSettings()
  const { t } = useTranslation(language)

  return (
    <footer className="border-t border-neutral-800/50 bg-neutral-900/70 backdrop-blur-md py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="text-neutral-400 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            &copy; {new Date().getFullYear()} Chess Game. {t("allRightsReserved")}
          </motion.div>

          <motion.div
            className="flex items-center space-x-4 mt-4 md:mt-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <a
                href="https://github.com/rishabhojha22"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center"
                rel="noreferrer"
              >
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                {t("support")}
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <a
                href="https://github.com/rishabhojha22"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

