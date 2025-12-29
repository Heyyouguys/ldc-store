import { z } from "zod";

// 创建订单验证
export const createOrderSchema = z.object({
  productId: z.string().uuid("无效的商品ID"),
  quantity: z.number().int().min(1, "数量至少为1").max(100, "数量不能超过100"),
  email: z.string().email("请输入有效的邮箱地址"),
  queryPassword: z
    .string()
    .min(6, "查询密码至少6位")
    .max(32, "查询密码最多32位"),
  paymentMethod: z.enum(["ldc", "alipay", "wechat", "usdt"]).default("ldc"),
});

// 查询订单验证
export const queryOrderSchema = z.object({
  orderNoOrEmail: z.string().min(1, "请输入订单号或邮箱"),
  queryPassword: z.string().min(1, "请输入查询密码"),
});

// 管理员更新订单状态验证
export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "completed", "expired", "refunded"]),
  adminRemark: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type QueryOrderInput = z.infer<typeof queryOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

