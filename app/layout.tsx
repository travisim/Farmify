import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AgriTrust XRPL",
  description: "Connecting farmers and investors through blockchain technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  )
}
