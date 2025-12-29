import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { OrderForm } from "./order-form";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "商品未找到" };
  }

  return {
    title: `${product.name} - LDC Store`,
    description: product.description || product.name,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;
  const hasDiscount =
    product.originalPrice &&
    parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - parseFloat(product.price) / parseFloat(product.originalPrice!)) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-violet-600">
          首页
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-violet-600"
            >
              {product.category.name}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </>
        )}
        <span className="text-zinc-900 dark:text-zinc-100">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-24 w-24 text-zinc-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white shadow-lg">
                <Star className="mr-1 h-3 w-3" />
                热门推荐
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-white shadow-lg">
                限时 {discountPercent}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category && (
            <Link href={`/category/${product.category.slug}`}>
              <Badge variant="secondary" className="mb-3 w-fit">
                {product.category.name}
              </Badge>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 lg:text-3xl">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              已售 {product.salesCount}
            </span>
            <span
              className={`flex items-center gap-1 ${
                isOutOfStock ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {isOutOfStock ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              库存 {product.stock}
            </span>
          </div>

          <Separator className="my-6" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
              ¥{product.price}
            </span>
            {hasDiscount && (
              <span className="text-lg text-zinc-400 line-through">
                ¥{product.originalPrice}
              </span>
            )}
            <span className="text-sm text-zinc-500">/件</span>
          </div>

          <Separator className="my-6" />

          {/* Order Form */}
          {isOutOfStock ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950">
              <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
              <p className="mt-3 font-medium text-rose-700 dark:text-rose-300">
                商品暂时缺货
              </p>
              <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
                请稍后再来查看
              </p>
            </div>
          ) : (
            <OrderForm
              productId={product.id}
              productName={product.name}
              price={parseFloat(product.price)}
              stock={product.stock}
              minQuantity={product.minQuantity}
              maxQuantity={product.maxQuantity}
            />
          )}
        </div>
      </div>

      {/* Product Content */}
      {product.content && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            商品详情
          </h2>
          <div className="prose prose-zinc max-w-none rounded-xl border border-zinc-200 bg-white p-6 dark:prose-invert dark:border-zinc-800 dark:bg-zinc-900">
            <div dangerouslySetInnerHTML={{ __html: product.content }} />
          </div>
        </div>
      )}
    </div>
  );
}

