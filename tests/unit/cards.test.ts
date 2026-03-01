import { beforeEach, describe, expect, it, vi } from "vitest";

// 关键：避免在单元测试中初始化真实数据库连接（lib/db 会强依赖 DATABASE_URL）
// vi.hoisted ensures dbMocks is available when vi.mock factory runs
const { dbMocks, authMock } = vi.hoisted(() => ({
  dbMocks: {
    mockReturning: vi.fn(),
    mockWhere: vi.fn(),
    mockSet: vi.fn(),
    mockUpdate: vi.fn(),
  },
  authMock: vi.fn(),
}));

vi.mock("@/lib/db", () => {
  // Build chain inside factory - references dbMocks which is hoisted
  dbMocks.mockWhere.mockImplementation(() => ({ returning: dbMocks.mockReturning }));
  dbMocks.mockSet.mockImplementation(() => ({ where: dbMocks.mockWhere }));
  dbMocks.mockUpdate.mockImplementation(() => ({ set: dbMocks.mockSet }));
  
  return {
    db: {
      update: dbMocks.mockUpdate,
    },
    cards: {},
    products: {},
  };
});

vi.mock("@/lib/auth", () => ({
  auth: () => authMock(),
}));

vi.mock("@/lib/cache", () => ({
  revalidateCardCache: vi.fn(),
}));

import { createCard, relistRefundedCards } from "@/lib/actions/cards";
import { revalidateCardCache } from "@/lib/cache";

describe("createCard", () => {
  it("should reject when user is not admin", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "user",
      },
    });

    const result = await createCard({
      productId: "00000000-0000-0000-0000-000000000000",
      content: "card-001",
      deduplicate: true,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("需要管理员权限");
  });

  it("should validate input before touching database", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "admin",
      },
    });

    const result = await createCard({
      productId: "not-a-uuid",
      content: "card-001",
      deduplicate: true,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("无效的商品ID");
  });

  it("should reject empty content", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "admin",
      },
    });

    const result = await createCard({
      productId: "00000000-0000-0000-0000-000000000000",
      content: "   ",
      deduplicate: true,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("卡密内容不能为空");
  });
});

describe("relistRefundedCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-setup chain after clearAllMocks
    dbMocks.mockWhere.mockImplementation(() => ({ returning: dbMocks.mockReturning }));
    dbMocks.mockSet.mockImplementation(() => ({ where: dbMocks.mockWhere }));
    dbMocks.mockUpdate.mockImplementation(() => ({ set: dbMocks.mockSet }));
  });

  it("should reject when user is not admin", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "user",
      },
    });

    const result = await relistRefundedCards(["card-1", "card-2"]);

    expect(result.success).toBe(false);
    expect(result.message).toContain("需要管理员权限");
  });

  it("should reject empty card selection", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "admin",
      },
    });

    const result = await relistRefundedCards([]);

    expect(result.success).toBe(false);
    expect(result.message).toBe("请选择要重新上架的卡密");
  });

  it("should successfully relist refunded cards and revalidate cache", async () => {
    authMock.mockResolvedValueOnce({
      user: {
        id: "u1",
        role: "admin",
      },
    });

    // Mock db.update chain returning 2 updated cards
    dbMocks.mockReturning.mockResolvedValueOnce([{ id: "card-1" }, { id: "card-2" }]);

    const result = await relistRefundedCards(["card-1", "card-2"]);

    expect(result.success).toBe(true);
    expect(result.message).toContain("2");
    expect(revalidateCardCache).toHaveBeenCalled();
  });
});
