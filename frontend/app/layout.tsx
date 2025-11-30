import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorProvider } from "@/lib/contexts/ErrorContext"
import { LoadingProvider } from "@/lib/contexts/LoadingContext"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import { GlobalLoadingDisplay } from "@/lib/contexts/LoadingContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
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
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <ErrorProvider>
          <LoadingProvider>
            <AuthProvider>
              {children}
              <GlobalLoadingDisplay />
            </AuthProvider>
          </LoadingProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
