import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// 创建 postgres 客户端
// 在生产环境中，推荐使用连接池
const client = postgres(connectionString, {
  max: process.env.NODE_ENV === "production" ? 10 : 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// 创建 drizzle 实例
export const db = drizzle(client, { schema });

// 导出 schema 供其他模块使用
export * from "./schema";

