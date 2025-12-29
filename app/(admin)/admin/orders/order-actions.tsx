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
import { MoreHorizontal, CheckCircle2, Eye, Copy } from "lucide-react";
import { adminCompleteOrder } from "@/lib/actions/orders";
import { toast } from "sonner";

interface OrderActionsProps {
  orderId: string;
  orderNo: string;
  status: string;
}

export function OrderActions({ orderId, orderNo, status }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    if (!confirm("确定要手动完成此订单吗？此操作将发放卡密。")) {
      return;
    }

    startTransition(async () => {
      const result = await adminCompleteOrder(orderId, "管理员手动完成");
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const copyOrderNo = () => {
    navigator.clipboard.writeText(orderNo);
    toast.success("订单号已复制");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyOrderNo}>
          <Copy className="mr-2 h-4 w-4" />
          复制订单号
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          查看详情
        </DropdownMenuItem>
        {(status === "pending" || status === "paid") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              手动完成
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

