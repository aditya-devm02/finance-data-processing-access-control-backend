import { AnalyticsService } from "../../src/services/analytics.service";

describe("AnalyticsService", () => {
  const financialRecordRepository = {
    listForAnalytics: jest.fn(),
  };

  const service = new AnalyticsService(financialRecordRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns dashboard totals and grouped analytics", async () => {
    financialRecordRepository.listForAnalytics.mockResolvedValue([
      {
        id: "1",
        amount: { valueOf: () => 1000, toString: () => "1000.00" },
        type: "INCOME",
        category: "Salary",
        date: new Date("2026-01-05T00:00:00.000Z"),
        description: "Paycheck",
        createdBy: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: "2",
        amount: { valueOf: () => 200, toString: () => "200.00" },
        type: "EXPENSE",
        category: "Food",
        date: new Date("2026-01-06T00:00:00.000Z"),
        description: "Groceries",
        createdBy: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    const result = await service.getDetailedAnalytics({ limit: 5 });

    expect(result.totalIncome).toBe(1000);
    expect(result.totalExpenses).toBe(200);
    expect(result.netBalance).toBe(800);
    expect(result.categoryWiseTotals).toHaveLength(2);
  });
});
