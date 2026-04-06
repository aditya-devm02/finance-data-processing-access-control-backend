import { FinancialRecord, Prisma, User } from "@prisma/client";

export const serializeUser = (user: Omit<User, "passwordHash">) => ({
  ...user,
});

export const serializeFinancialRecord = (record: FinancialRecord) => ({
  ...record,
  amount: Number(record.amount),
});

export const decimalToNumber = (value: Prisma.Decimal | null | undefined): number =>
  value ? Number(value) : 0;
