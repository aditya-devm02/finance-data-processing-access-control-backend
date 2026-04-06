import { UserService } from "../../src/services/user.service";
import { AppError } from "../../src/utils/app-error";

jest.mock("../../src/utils/password", () => ({
  hashPassword: jest.fn(async (password: string) => `hashed-${password}`),
}));

describe("UserService", () => {
  const userRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
    findAnyAdmin: jest.fn(),
  };

  const service = new UserService(userRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user with a hashed password", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: "user-1",
      name: "Admin",
      email: "admin@example.com",
      passwordHash: "hashed-Password1",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await service.createUser({
      name: "Admin",
      email: "admin@example.com",
      password: "Password1",
      role: "ADMIN",
      status: "ACTIVE",
    });

    expect(userRepository.create).toHaveBeenCalled();
    expect(result.email).toBe("admin@example.com");
  });

  it("prevents deleting the last active admin", async () => {
    userRepository.findById.mockResolvedValue({
      id: "user-1",
      role: "ADMIN",
      status: "ACTIVE",
    });
    userRepository.count.mockResolvedValue(1);

    await expect(service.deleteUser("user-1")).rejects.toBeInstanceOf(AppError);
  });
});
