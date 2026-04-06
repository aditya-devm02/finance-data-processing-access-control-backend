import { FinancialRecord, Prisma, RecordType } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface CreateFinancialRecordInput {
  amount: Prisma.Decimal;
  type: RecordType;
  category: string;
  date: Date;
  description?: string;
  createdBy: string;
}

export interface UpdateFinancialRecordInput {
  amount?: Prisma.Decimal;
  type?: RecordType;
  category?: string;
  date?: Date;
  description?: string | null;
}

export interface FinancialRecordFilters {
  page: number;
  limit: number;
  category?: string;
  type?: RecordType;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export class FinancialRecordRepository {
  async create(data: CreateFinancialRecordInput): Promise<FinancialRecord> {
    return prisma.financialRecord.create({ data });
  }

  async findById(id: string): Promise<FinancialRecord | null> {
    return prisma.financialRecord.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async update(id: string, data: UpdateFinancialRecordInput): Promise<FinancialRecord> {
    return prisma.financialRecord.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<FinancialRecord> {
    return prisma.financialRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(filters: FinancialRecordFilters): Promise<{ data: FinancialRecord[]; total: number }> {
    const where = this.buildWhere(filters);
    const skip = (filters.page - 1) * filters.limit;

    // Returning rows and total from the same transaction keeps pagination metadata aligned with the filtered dataset.
    const [data, total] = await prisma.$transaction([
      prisma.financialRecord.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: filters.limit,
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return { data, total };
  }

  async listForAnalytics(filters: Omit<FinancialRecordFilters, "page" | "limit" | "search"> & { search?: string }) {
    return prisma.financialRecord.findMany({
      where: this.buildWhere({ page: 1, limit: 100000, ...filters }),
      orderBy: { date: "desc" },
    });
  }

  private buildWhere(filters: Partial<FinancialRecordFilters>): Prisma.FinancialRecordWhereInput {
    const dateFilter: Prisma.DateTimeFilter | undefined =
      filters.startDate || filters.endDate
        ? {
            ...(filters.startDate ? { gte: filters.startDate } : {}),
            ...(filters.endDate ? { lte: filters.endDate } : {}),
          }
        : undefined;

    const searchFilter: Prisma.FinancialRecordWhereInput = filters.search
      ? {
          OR: [
            { category: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {};

    const where: Prisma.FinancialRecordWhereInput = {
      deletedAt: null,
      ...searchFilter,
    };

    if (filters.category) {
      where.category = { equals: filters.category, mode: "insensitive" };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (dateFilter) {
      where.date = dateFilter;
    }

    return where;
  }
}
