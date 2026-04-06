import { FinancialRecord } from "@prisma/client";
import { CategoryTotalsModel, DateSummaryModel, TrendPointModel } from "../models/analytics.model";
import { FinancialRecordRepository } from "../repositories/financial-record.repository";
import { decimalToNumber, serializeFinancialRecord } from "../utils/serializer";

export interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export class AnalyticsService {
  constructor(
    private readonly financialRecordRepository: FinancialRecordRepository = new FinancialRecordRepository(),
  ) {}

  async getDashboardSummary(query: AnalyticsQuery) {
    const records = await this.fetchRecords(query);
    const income = this.sumByType(records, "INCOME");
    const expenses = this.sumByType(records, "EXPENSE");

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      recordCount: records.length,
    };
  }

  async getDetailedAnalytics(query: AnalyticsQuery) {
    const records = await this.fetchRecords(query);
    const income = this.sumByType(records, "INCOME");
    const expenses = this.sumByType(records, "EXPENSE");

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      categoryWiseTotals: this.groupByCategory(records),
      monthlyTrends: this.groupByPeriod(records, "month"),
      weeklyTrends: this.groupByPeriod(records, "week"),
      recentTransactions: records
        .slice(0, query.limit ?? 5)
        .map(serializeFinancialRecord),
      summaryByDate: this.groupByDate(records),
    };
  }

  private async fetchRecords(query: AnalyticsQuery) {
    return this.financialRecordRepository.listForAnalytics({
      ...(query.startDate ? { startDate: query.startDate } : {}),
      ...(query.endDate ? { endDate: query.endDate } : {}),
    });
  }

  private sumByType(records: FinancialRecord[], type: "INCOME" | "EXPENSE") {
    return Number(
      records
        .filter((record) => record.type === type)
        .reduce((sum, record) => sum + decimalToNumber(record.amount), 0)
        .toFixed(2),
    );
  }

  private groupByCategory(records: FinancialRecord[]) {
    const map = new Map<string, CategoryTotalsModel>();

    for (const record of records) {
      const current = map.get(record.category) ?? {
        category: record.category,
        income: 0,
        expense: 0,
        net: 0,
      };
      const amount = decimalToNumber(record.amount);

      if (record.type === "INCOME") {
        current.income += amount;
      } else {
        current.expense += amount;
      }

      current.net = Number((current.income - current.expense).toFixed(2));
      map.set(record.category, current);
    }

    return Array.from(map.values()).map((item) => ({
      ...item,
      income: Number(item.income.toFixed(2)),
      expense: Number(item.expense.toFixed(2)),
    }));
  }

  private groupByPeriod(records: FinancialRecord[], granularity: "month" | "week") {
    const map = new Map<string, TrendPointModel>();

    for (const record of records) {
      const date = new Date(record.date);
      const key =
        granularity === "month"
          ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
          : this.getWeekKey(date);

      // Aggregating into stable period buckets keeps the analytics payload directly usable by charts.
      const current = map.get(key) ?? { period: key, income: 0, expense: 0, net: 0 };
      const amount = decimalToNumber(record.amount);

      if (record.type === "INCOME") {
        current.income += amount;
      } else {
        current.expense += amount;
      }

      current.net = Number((current.income - current.expense).toFixed(2));
      map.set(key, current);
    }

    return Array.from(map.values()).sort((a, b) => a.period.localeCompare(b.period));
  }

  private groupByDate(records: FinancialRecord[]) {
    const map = new Map<string, DateSummaryModel>();

    for (const record of records) {
      const key = record.date.toISOString().slice(0, 10);
      const current = map.get(key) ?? { date: key, income: 0, expense: 0, net: 0 };
      const amount = decimalToNumber(record.amount);

      if (record.type === "INCOME") {
        current.income += amount;
      } else {
        current.expense += amount;
      }

      current.net = Number((current.income - current.expense).toFixed(2));
      map.set(key, current);
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  private getWeekKey(date: Date) {
    const firstDayOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const pastDays = Math.floor((date.getTime() - firstDayOfYear.getTime()) / 86400000);
    const week = Math.ceil((pastDays + firstDayOfYear.getUTCDay() + 1) / 7);

    return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }
}
