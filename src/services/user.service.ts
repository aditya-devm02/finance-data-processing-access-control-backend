import { User } from "@prisma/client";
import { CreateUserModel, UpdateUserModel } from "../models/user.model";
import { AppError } from "../utils/app-error";
import { hashPassword } from "../utils/password";
import { UserRepository } from "../repositories/user.repository";
import { serializeUser } from "../utils/serializer";

export interface CreateUserDto extends CreateUserModel {}

export interface UpdateUserDto extends UpdateUserModel {}

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async createUser(payload: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new AppError(409, "Email already exists", "EMAIL_EXISTS");
    }

    // Password hashing belongs in the service layer so no controller can accidentally persist raw credentials.
    const passwordHash = await hashPassword(payload.password);
    const user = await this.userRepository.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role,
      status: payload.status,
    });

    return serializeUser(this.omitPasswordHash(user));
  }

  async listUsers() {
    return this.userRepository.list();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return serializeUser(this.omitPasswordHash(user));
  }

  async updateUser(id: string, payload: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    if (payload.email && payload.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(payload.email);
      if (existingUser) {
        throw new AppError(409, "Email already exists", "EMAIL_EXISTS");
      }
    }

    const updatedUser = await this.userRepository.update(id, {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.password ? { passwordHash: await hashPassword(payload.password) } : {}),
    });

    return serializeUser(this.omitPasswordHash(updatedUser));
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    if (user.role === "ADMIN") {
      // Prevent deleting the final active admin so the platform always remains administrable.
      const activeAdmins = await this.userRepository.count({
        role: "ADMIN",
        status: "ACTIVE",
        deletedAt: null,
      });

      if (activeAdmins <= 1) {
        throw new AppError(400, "At least one active admin must remain", "LAST_ADMIN");
      }
    }

    await this.userRepository.softDelete(id);

    return { message: "User deleted successfully" };
  }

  async ensureBootstrapAdmin(name: string, email: string, password: string) {
    const existingAdmin = await this.userRepository.findAnyAdmin();
    if (existingAdmin) {
      return;
    }

    await this.createUser({
      name,
      email,
      password,
      role: "ADMIN",
      status: "ACTIVE",
    });
  }

  private omitPasswordHash(user: User): Omit<User, "passwordHash"> {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
