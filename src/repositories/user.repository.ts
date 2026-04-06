import { Prisma, Role, User, UserStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  status?: UserStatus;
}

export class UserRepository {
  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findAnyAdmin(): Promise<User | null> {
    return prisma.user.findFirst({
      where: { role: "ADMIN", deletedAt: null },
    });
  }

  async list(): Promise<Omit<User, "passwordHash">[]> {
    return prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "INACTIVE",
      },
    });
  }

  async count(filter: Prisma.UserWhereInput = {}): Promise<number> {
    return prisma.user.count({ where: filter });
  }
}
