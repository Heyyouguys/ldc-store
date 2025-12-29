import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { Toaster } from "@/components/ui/sonner";
import { getActiveCategories } from "@/lib/actions/categories";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getActiveCategories();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header
        categories={categories}
        siteName={process.env.NEXT_PUBLIC_SITE_NAME || "LDC Store"}
      />
      <main className="flex-1">{children}</main>
      <Footer siteName={process.env.NEXT_PUBLIC_SITE_NAME || "LDC Store"} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

