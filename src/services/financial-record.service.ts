import { Prisma } from "@prisma/client";
import { FinancialRecordFiltersModel } from "../models/financial-record.model";
import { AppError } from "../utils/app-error";
import { FinancialRecordRepository } from "../repositories/financial-record.repository";
import { UserRepository } from "../repositories/user.repository";
import { serializeFinancialRecord } from "../utils/serializer";

export interface CreateFinancialRecordDto {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: Date;
  description?: string;
  createdBy: string;
}

export interface UpdateFinancialRecordDto {
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  date?: Date;
  description?: string | null;
}

export interface ListFinancialRecordDto extends FinancialRecordFiltersModel {}

export class FinancialRecordService {
  constructor(
    private readonly financialRecordRepository: FinancialRecordRepository = new FinancialRecordRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async createRecord(payload: CreateFinancialRecordDto) {
    const creator = await this.userRepository.findById(payload.createdBy);
    if (!creator) {
      throw new AppError(404, "Creator user not found", "CREATOR_NOT_FOUND");
    }

    // Convert to Decimal at the persistence boundary so arithmetic stays precise for currency storage.
    const record = await this.financialRecordRepository.create({
      ...payload,
      amount: new Prisma.Decimal(payload.amount),
    });

    return serializeFinancialRecord(record);
  }

  async listRecords(filters: ListFinancialRecordDto) {
    const { data, total } = await this.financialRecordRepository.list(filters);

    return {
      data: data.map(serializeFinancialRecord),
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit) || 1,
      },
    };
  }

  async getRecordById(id: string) {
    const record = await this.financialRecordRepository.findById(id);
    if (!record) {
      throw new AppError(404, "Financial record not found", "RECORD_NOT_FOUND");
    }

    return serializeFinancialRecord(record);
  }

  async updateRecord(id: string, payload: UpdateFinancialRecordDto) {
    const record = await this.financialRecordRepository.findById(id);
    if (!record) {
      throw new AppError(404, "Financial record not found", "RECORD_NOT_FOUND");
    }

    const updatedRecord = await this.financialRecordRepository.update(id, {
      ...(payload.amount !== undefined ? { amount: new Prisma.Decimal(payload.amount) } : {}),
      ...(payload.type ? { type: payload.type } : {}),
      ...(payload.category ? { category: payload.category } : {}),
      ...(payload.date ? { date: payload.date } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
    });

    return serializeFinancialRecord(updatedRecord);
  }

  async deleteRecord(id: string) {
    const record = await this.financialRecordRepository.findById(id);
    if (!record) {
      throw new AppError(404, "Financial record not found", "RECORD_NOT_FOUND");
    }

    await this.financialRecordRepository.softDelete(id);

    return { message: "Financial record deleted successfully" };
  }
}
