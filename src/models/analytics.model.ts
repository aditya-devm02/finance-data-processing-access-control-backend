export interface TrendPointModel {
  period: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryTotalsModel {
  category: string;
  income: number;
  expense: number;
  net: number;
}

export interface DateSummaryModel {
  date: string;
  income: number;
  expense: number;
  net: number;
}
