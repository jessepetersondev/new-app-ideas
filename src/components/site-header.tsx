"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Menu, X } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", requiresAuth: false },
    { href: "/predict", label: "Predict", requiresAuth: true },
    { href: "/pricing", label: "Pricing", requiresAuth: false },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresAuth || session
  );

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        Skip to main content
      </a>
      <header className="border-b" role="banner">
        <nav
          className="container mx-auto px-4 py-4"
          aria-label="Main navigation"
        >
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors min-h-[44px]"
                aria-label="Virality Predictor - Go to homepage"
              >
                <div
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex-shrink-0"
                  aria-hidden="true"
                >
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
                  Virality Predictor
                </span>
              </Link>
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div
              className="hidden md:flex items-center gap-4"
              role="group"
              aria-label="User actions"
            >
              <UserProfile />
              <ModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="min-h-[44px] min-w-[44px]"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4">
              <div className="flex flex-col gap-2">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-3 py-2.5 rounded-md min-h-[44px] flex items-center",
                      pathname === link.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t pt-4">
                <UserProfile />
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
