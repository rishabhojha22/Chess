import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Roboto, Montserrat, Open_Sans, Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chess Game",
  description: "A modern chess application built with Next.js",
  generator: "Rishabh Ojha",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/ico/CMU.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} ${roboto.variable} ${montserrat.variable} ${openSans.variable} ${poppins.variable} min-h-screen font-poppins`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

