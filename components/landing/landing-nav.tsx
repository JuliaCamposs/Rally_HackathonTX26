"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why", label: "Why Choose Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faqs", label: "FAQs" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="landing-nav">
      <div className="landing-wrap flex items-center gap-4">
        <Link href="/" aria-label="Rally home" className="rally-logo">
          <Image src="/brand/rally-logo.svg" alt="Rally" width={110} height={56} priority />
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Landing">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="landing-nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          href="/app"
          className={cn(
            buttonVariants({ size: "lg" }),
            "ml-auto hidden h-10 rounded-xl bg-eucalyptus px-4 text-[13px] font-bold text-white hover:bg-eucalyptus/90 lg:inline-flex lg:ml-4",
          )}
        >
          Download App
        </Link>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "ml-auto size-10 rounded-xl border-line lg:hidden",
          )}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[280px] border-line bg-page p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-[15px] font-semibold text-ink hover:bg-line-soft"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/app"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-3 h-11 rounded-xl bg-eucalyptus font-bold text-white hover:bg-eucalyptus/90",
              )}
            >
              Download App
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
