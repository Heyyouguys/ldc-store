import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: routerMocks.refresh,
  }),
}));

vi.mock("@/lib/actions/cards", () => ({
  deleteCards: vi.fn(),
  relistRefundedCards: vi.fn(),
  resetLockedCards: vi.fn(),
}));

import { CardsTable } from "@/app/(admin)/admin/cards/cards-table";
import type { AdminCardListItem } from "@/app/(admin)/admin/cards/cards-table";

describe("CardsTable refunded card support", () => {
  beforeEach(() => {
    routerMocks.refresh.mockReset();
  });

  const refundedCard: AdminCardListItem = {
    id: "card-refunded-1",
    content: "REFUND-CODE-123",
    contentMasked: false,
    status: "refunded",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    orderId: "order-123",
    order: { id: "order-123", orderNo: "ORD-2025-001" },
  };

  const availableCard: AdminCardListItem = {
    id: "card-available-1",
    content: "AVAIL-CODE-456",
    contentMasked: false,
    status: "available",
    createdAt: new Date("2025-01-02T00:00:00Z"),
    orderId: null,
    order: null,
  };

  it("refunded row renders status badge with text '退款'", () => {
    render(<CardsTable items={[refundedCard]} />);

    const badge = screen.getByText("退款");
    expect(badge).toBeInTheDocument();
  });

  it("refunded row shows relist action button with title='重新上架'", () => {
    render(<CardsTable items={[refundedCard]} />);

    const relistButton = screen.getByTitle("重新上架");
    expect(relistButton).toBeInTheDocument();
  });

  it("bulk relist button is disabled when no cards selected", () => {
    render(<CardsTable items={[refundedCard]} />);

    // bulk bar 按钮是 outline variant，行内按钮是 ghost variant
    const bulkRelistButton = screen.getAllByRole("button", { name: /重新上架/ })
      .find((btn) => btn.getAttribute("data-variant") === "outline");
    expect(bulkRelistButton).toBeDisabled();
  });

  it("bulk relist button is enabled after selecting refunded row", () => {
    render(<CardsTable items={[refundedCard]} />);

    const checkbox = screen.getByLabelText("选择卡密");
    fireEvent.click(checkbox);

    const bulkRelistButton = screen.getAllByRole("button", { name: /重新上架/ })
      .find((btn) => btn.getAttribute("data-variant") === "outline");
    expect(bulkRelistButton).toBeEnabled();
  });

  it("bulk relist button stays disabled when only available cards selected", () => {
    render(<CardsTable items={[availableCard]} />);

    const checkbox = screen.getByLabelText("选择卡密");
    fireEvent.click(checkbox);

    const bulkRelistButton = screen.getByRole("button", { name: /重新上架/ });
    expect(bulkRelistButton).toBeDisabled();
  });
});
