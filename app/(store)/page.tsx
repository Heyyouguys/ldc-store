import { Suspense } from "react";
import { ProductCard } from "@/components/store/product-card";
import { AnnouncementBanner } from "@/components/store/announcement-banner";
import { getActiveProducts } from "@/lib/actions/products";
import { getActiveCategories } from "@/lib/actions/categories";
import { db, announcements } from "@/lib/db";
import { eq, and, or, lte, gte, isNull, desc, asc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Sparkles, Grid3X3, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HomePageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

async function getActiveAnnouncements() {
  const now = new Date();
  return db.query.announcements.findMany({
    where: and(
      eq(announcements.isActive, true),
      or(isNull(announcements.startAt), lte(announcements.startAt, now)),
      or(isNull(announcements.endAt), gte(announcements.endAt, now))
    ),
    orderBy: [asc(announcements.sortOrder), desc(announcements.createdAt)],
    limit: 5,
  });
}

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {search ? "未找到相关商品" : "暂无商品"}
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          {search ? "请尝试其他搜索词" : "商品即将上架，敬请期待"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

async function FeaturedProducts() {
  const products = await getActiveProducts({
    featured: true,
    limit: 4,
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            热门推荐
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  );
}

async function CategoryNav() {
  const categories = await getActiveCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-violet-600" />
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">商品分类</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300"
          >
            全部
          </Button>
        </Link>
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search } = await searchParams;
  const activeAnnouncements = await getActiveAnnouncements();

  return (
    <>
      {/* Announcements */}
      <AnnouncementBanner announcements={activeAnnouncements} />

      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        {search && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              搜索结果: &ldquo;{search}&rdquo;
            </h1>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                清除搜索
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Category Navigation */}
        {!search && <CategoryNav />}

        {/* Featured Products */}
        {!search && (
          <Suspense
            fallback={
              <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        )}

        {/* All Products */}
        <section>
          {!search && (
            <div className="mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                全部商品
              </h2>
            </div>
          )}

          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProductGrid search={search} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

