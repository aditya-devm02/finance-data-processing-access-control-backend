import { FinancialRecordService } from "../../src/services/financial-record.service";
import { AppError } from "../../src/utils/app-error";

describe("FinancialRecordService", () => {
  const financialRecordRepository = {
    create: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const userRepository = {
    findById: jest.fn(),
  };

  const service = new FinancialRecordService(financialRecordRepository as any, userRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a record when the creator exists", async () => {
    userRepository.findById.mockResolvedValue({ id: "admin-1" });
    financialRecordRepository.create.mockResolvedValue({
      id: "record-1",
      amount: { toString: () => "1000.50", valueOf: () => 1000.5 },
      type: "INCOME",
      category: "Salary",
      date: new Date("2026-01-01T00:00:00.000Z"),
      description: "Monthly salary",
      createdBy: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await service.createRecord({
      amount: 1000.5,
      type: "INCOME",
      category: "Salary",
      date: new Date("2026-01-01T00:00:00.000Z"),
      description: "Monthly salary",
      createdBy: "admin-1",
    });

    expect(result.amount).toBe(1000.5);
  });

  it("throws when trying to delete a missing record", async () => {
    financialRecordRepository.findById.mockResolvedValue(null);

    await expect(service.deleteRecord("record-1")).rejects.toBeInstanceOf(AppError);
  });
});
