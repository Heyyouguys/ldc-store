import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { Toaster } from "@/components/ui/sonner";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LDC Store";

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} />
      <main className="flex-1">{children}</main>
      <Footer siteName={siteName} />
      <Toaster position="top-center" richColors />
    </div>
  );
}
