import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Search, Home } from "lucide-react";

interface OrderResultPageProps {
  searchParams: Promise<{ orderNo?: string; status?: string }>;
}

export default async function OrderResultPage({
  searchParams,
}: OrderResultPageProps) {
  const { orderNo, status } = await searchParams;

  const isSuccess = status === "success" || !status;

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <Card className="overflow-hidden">
        <div
          className={`py-8 text-center ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : "bg-gradient-to-br from-amber-500 to-orange-600"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="mx-auto h-16 w-16 text-white" />
          ) : (
            <Clock className="mx-auto h-16 w-16 text-white" />
          )}
          <h1 className="mt-4 text-2xl font-bold text-white">
            {isSuccess ? "订单提交成功" : "等待支付"}
          </h1>
        </div>

        <CardContent className="space-y-6 p-6">
          {orderNo && (
            <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-500">订单号</p>
              <p className="mt-1 font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {orderNo}
              </p>
            </div>
          )}

          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            {isSuccess ? (
              <>
                <p>✅ 支付成功后，卡密将自动发放</p>
                <p>📧 您可以使用下单时的邮箱和查询密码查询订单</p>
                <p>💡 请妥善保管您的查询密码</p>
              </>
            ) : (
              <>
                <p>⏳ 请在 30 分钟内完成支付</p>
                <p>🔒 支付完成后系统将自动发货</p>
                <p>❌ 超时未支付订单将自动取消</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/order/query">
              <Button className="w-full gap-2" variant="default">
                <Search className="h-4 w-4" />
                查询订单
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full gap-2" variant="outline">
                <Home className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

