import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-primary/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-sapphire">
          EBB.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm tracking-widest uppercase hover:text-primary transition-colors">Home</Link>
          <Link href="/shop" className="text-sm tracking-widest uppercase hover:text-gold transition-colors">Shop</Link>
          <Link href="/admin" className="text-sm tracking-widest uppercase transition-colors text-muted-foreground hover:text-sapphire">Admin</Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-primary/20 p-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider block p-2">Home</Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider block p-2">Shop</Link>
          <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg uppercase tracking-wider block p-2 text-muted-foreground">Admin</Link>
        </div>
      )}
    </header>
  );
}
