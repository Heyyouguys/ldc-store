"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { toggleCategoryActive, deleteCategory } from "@/lib/actions/categories";
import { toast } from "sonner";

interface CategoryActionsProps {
  categoryId: string;
  isActive: boolean;
  productCount: number;
}

export function CategoryActions({
  categoryId,
  isActive,
  productCount,
}: CategoryActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = () => {
    startTransition(async () => {
      const result = await toggleCategoryActive(categoryId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (productCount > 0) {
      toast.error(`该分类下有 ${productCount} 个商品，无法删除`);
      return;
    }

    if (!confirm("确定要删除此分类吗？")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleActive}>
          {isActive ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              隐藏
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              显示
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-rose-600 focus:text-rose-600"
          disabled={productCount > 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

