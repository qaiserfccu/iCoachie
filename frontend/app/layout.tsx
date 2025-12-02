import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "iCoachie - All-in-One Coaching Platform",
  description:
    "The complete platform for clubs, coaches, freelancers, kids and parents. Registration, scheduling, payments, management, attendance, progress tracking and more.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
