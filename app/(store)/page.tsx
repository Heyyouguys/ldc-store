import { Suspense } from "react";
import { ProductCard } from "@/components/store/product-card";
import { getActiveProducts } from "@/lib/actions/products";
import { getActiveCategories } from "@/lib/actions/categories";
import { db, announcements } from "@/lib/db";
import { eq, and, or, lte, gte, isNull, desc, asc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

async function getActiveAnnouncement() {
  const now = new Date();
  return db.query.announcements.findFirst({
    where: and(
      eq(announcements.isActive, true),
      or(isNull(announcements.startAt), lte(announcements.startAt, now)),
      or(isNull(announcements.endAt), gte(announcements.endAt, now))
    ),
    orderBy: [asc(announcements.sortOrder), desc(announcements.createdAt)],
  });
}

function ProductSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-3 h-5 w-16" />
    </div>
  );
}

async function ProductGrid({ search }: { search?: string }) {
  const products = await getActiveProducts({
    search,
    limit: 20,
  });

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {search ? `未找到 "${search}" 相关商品` : "暂无商品"}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          description={product.description}
          price={product.price}
          originalPrice={product.originalPrice}
          coverImage={product.coverImage}
          stock={product.stock}
          isFeatured={product.isFeatured}
          salesCount={product.salesCount}
          category={product.category}
        />
      ))}
    </div>
  );
}

async function CategoryTabs() {
  const categories = await getActiveCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/">
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          全部
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search } = await searchParams;
  const announcement = await getActiveAnnouncement();

  return (
    <div className="container max-w-4xl py-6">
      {/* Announcement */}
      {announcement && (
        <div className="mb-6 rounded-lg border bg-muted/50 px-4 py-3">
          <p className="text-sm">
            <span className="font-medium">{announcement.title}</span>
            {announcement.content && (
              <span className="text-muted-foreground"> — {announcement.content}</span>
            )}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {search ? (
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">搜索: {search}</h1>
            <Link href="/">
              <Button variant="ghost" size="sm">
                清除
              </Button>
            </Link>
          </div>
        ) : (
          <h1 className="text-lg font-medium">商品列表</h1>
        )}
      </div>

      {/* Categories */}
      {!search && (
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-6 w-48" />}>
            <CategoryTabs />
          </Suspense>
        </div>
      )}

      {/* Products */}
      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ProductGrid search={search} />
      </Suspense>
    </div>
  );
}
