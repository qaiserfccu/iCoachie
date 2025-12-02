import type React from "react"
import type { Metadata } from "next"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "./globals.css"

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
    <html lang="en" className="antialiased">
      <body className="font-sans">{children}</body>
    </html>
  )
}
