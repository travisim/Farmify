import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import React from "react"

interface NavLink {
  href: string
  label: string
  isPrimary?: boolean
}

interface HeaderProps {
  title: string
  navLinks?: NavLink[]
  children?: React.ReactNode // For custom elements on the right side
}

export default function Header({ title, navLinks, children }: HeaderProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="font-bold text-xl">{title}</span>
            </Link>
          </div>

          {navLinks && navLinks.length > 0 && (
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={link.isPrimary ? "text-foreground font-medium" : "text-foreground/80 hover:text-foreground"}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </nav>
  )
}