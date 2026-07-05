export interface CategoryTheme {
  text: string;
  bg: string;
  border: string;
  glow: string;
}

const THEMES: Record<string, CategoryTheme> = {
  watches: {
    text: "text-gold",
    bg: "bg-gold",
    border: "border-gold/40",
    glow: "shadow-[0_0_25px_rgba(230,180,80,0.35)]",
  },
  necklaces: {
    text: "text-sapphire",
    bg: "bg-sapphire",
    border: "border-sapphire/40",
    glow: "shadow-[0_0_25px_rgba(60,130,230,0.35)]",
  },
  bracelets: {
    text: "text-ruby",
    bg: "bg-ruby",
    border: "border-ruby/40",
    glow: "shadow-[0_0_25px_rgba(230,60,90,0.35)]",
  },
  earrings: {
    text: "text-emerald",
    bg: "bg-emerald",
    border: "border-emerald/40",
    glow: "shadow-[0_0_25px_rgba(30,180,120,0.35)]",
  },
  rings: {
    text: "text-primary",
    bg: "bg-primary",
    border: "border-primary/40",
    glow: "shadow-[0_0_25px_rgba(220,60,150,0.35)]",
  },
};

const DEFAULT_THEME: CategoryTheme = {
  text: "text-primary",
  bg: "bg-primary",
  border: "border-primary/40",
  glow: "shadow-[0_0_25px_rgba(220,60,150,0.35)]",
};

export function getCategoryTheme(slug?: string | null): CategoryTheme {
  if (!slug) return DEFAULT_THEME;
  return THEMES[slug] || DEFAULT_THEME;
}
