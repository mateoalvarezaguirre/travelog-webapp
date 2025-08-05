import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Merriweather } from "next/font/google"
import Navbar from "@/components/navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
})

export const metadata = {
  title: "Travelog - Tu App de Bitácoras de Viaje",
  description: "Captura, preserva y comparte tus recuerdos de viaje con un toque de nostalgia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
          <Navbar />
          <main>{children}</main>
      </body>
    </html>
  )
}
