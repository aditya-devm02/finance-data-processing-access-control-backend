import { Role, UserStatus } from "@prisma/client";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserModel {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
}

export interface UpdateUserModel {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: UserStatus;
}
