import { RecordType } from "@prisma/client";

export interface FinancialRecordModel {
  id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface FinancialRecordFiltersModel {
  page: number;
  limit: number;
  category?: string;
  type?: RecordType;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
