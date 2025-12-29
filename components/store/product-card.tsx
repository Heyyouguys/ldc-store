import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Package, Star, TrendingUp } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  originalPrice?: string | null;
  coverImage?: string | null;
  stock: number;
  isFeatured?: boolean;
  salesCount?: number;
  category?: {
    name: string;
    slug: string;
  } | null;
}

export function ProductCard({
  name,
  slug,
  description,
  price,
  originalPrice,
  coverImage,
  stock,
  isFeatured,
  salesCount = 0,
  category,
}: ProductCardProps) {
  const isOutOfStock = stock === 0;
  const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(price);
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)
    : 0;

  return (
    <Link href={`/product/${slug}`} className="group">
      <Card className="overflow-hidden border-zinc-200 bg-white transition-all duration-300 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-zinc-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white shadow-sm">
                <Star className="mr-1 h-3 w-3" />
                热门
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-white shadow-sm">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                暂无库存
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {category && (
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
              {category.name}
            </span>
          )}

          {/* Title */}
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-zinc-900 group-hover:text-violet-600 dark:text-zinc-50 dark:group-hover:text-violet-400">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
              ¥{price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-zinc-400 line-through">
                ¥{originalPrice}
              </span>
            )}
          </div>

          {/* Stock & Sales */}
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {salesCount > 0 && (
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {salesCount}
              </span>
            )}
            <span className={isOutOfStock ? "text-rose-500" : ""}>
              库存 {stock}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

