export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold via-primary to-sapphire" />
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="font-serif text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-sapphire mb-2">Everything by Blessed</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Ultra-premium luxury jewelry, watches, and accessories. <br />
            Based in Lagos, Nigeria (Ojo, Abule area). <br />
            <span className="text-primary/80 font-medium">Online Store Only — No physical shop.</span>
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-center md:text-right">
          <a
            href="https://www.tiktok.com/@everythingbyblessed0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-sapphire font-medium tracking-wide hover:opacity-80 transition-opacity"
          >
            TikTok: @everythingbyblessed0
          </a>
          <p>&copy; {new Date().getFullYear()} Everything by Blessed.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
