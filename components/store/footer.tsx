interface FooterProps {
  siteName?: string;
}

export function Footer({ siteName = "LDC Store" }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex flex-col items-center justify-center gap-1 py-4 max-w-3xl px-4 text-sm text-white/60">
        <span>© {new Date().getFullYear()} {siteName}</span>
        <span className="text-xs text-white/40">本站与 Linux DO 官方无任何关系</span>
      </div>
    </footer>
  );
}
