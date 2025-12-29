import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(50, "分类名称最多50字符"),
  slug: z
    .string()
    .min(1, "URL标识不能为空")
    .max(50, "URL标识最多50字符")
    .regex(/^[a-z0-9-]+$/, "URL标识只能包含小写字母、数字和连字符"),
  description: z.string().max(200, "描述最多200字符").optional(),
  icon: z.string().max(50, "图标名称最多50字符").optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

