import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by AgriTrust XRPL Team &copy; {new Date().getFullYear()}
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Projects
          </Link>
          <Link href="/investor" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Investor
          </Link>
          <Link href="/farmer" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Farmer
          </Link>
          <Link
            href="/farmer/create-project"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Create Project
          </Link>
          <Link href="/farmer/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Farmer Signup
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/agritrust-xrpl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
