"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <span className="text-xl font-bold text-foreground">iCoachie</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25">
                Get Started
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Solutions
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Resources
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="justify-start w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gradient-primary text-white w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
