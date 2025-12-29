import Link from "next/link";

interface FooterProps {
  siteName?: string;
}

export function Footer({ siteName = "LDC Store" }: FooterProps) {
  return (
    <footer className="border-t">
      <div className="container flex h-14 max-w-4xl items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {siteName}</p>
        <Link href="/order/query" className="hover:text-foreground">
          订单查询
        </Link>
      </div>
    </footer>
  );
}
