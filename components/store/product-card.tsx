import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  stock,
  isFeatured,
  category,
}: ProductCardProps) {
  const isOutOfStock = stock === 0;
  const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(price);

  return (
    <Link href={`/product/${slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {category && (
                <p className="text-xs text-muted-foreground">{category.name}</p>
              )}
              <h3 className="font-medium leading-snug line-clamp-2">{name}</h3>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  热门
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  售罄
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold">¥{price}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ¥{originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">库存 {stock}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
