-- 添加新的订单状态枚举值
ALTER TYPE "public"."order_status" ADD VALUE IF NOT EXISTS 'refund_pending';
ALTER TYPE "public"."order_status" ADD VALUE IF NOT EXISTS 'refund_rejected';

-- 添加退款相关字段到订单表
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "refund_reason" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "refund_requested_at" timestamp with time zone;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "refunded_at" timestamp with time zone;

-- 注意：不创建基于新 enum 值的 partial index，因为 Postgres 要求新 enum 值必须在事务提交后才能用于 index predicate。
-- 如需此索引，可在迁移完成后手动执行：
-- CREATE INDEX IF NOT EXISTS "orders_refund_status_idx" ON "orders" USING btree ("status") WHERE status IN ('refund_pending', 'refund_rejected', 'refunded');
