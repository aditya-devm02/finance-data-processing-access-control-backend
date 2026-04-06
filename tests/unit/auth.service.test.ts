import { AuthService } from "../../src/services/auth.service";
import { AppError } from "../../src/utils/app-error";

jest.mock("../../src/utils/password", () => ({
  comparePassword: jest.fn(),
}));

jest.mock("../../src/utils/jwt", () => ({
  signToken: jest.fn(() => "signed-token"),
}));

import { comparePassword } from "../../src/utils/password";

describe("AuthService", () => {
  const userRepository = {
    findByEmail: jest.fn(),
  };

  const service = new AuthService(userRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a signed token for valid credentials", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: "user-1",
      email: "analyst@example.com",
      passwordHash: "hashed",
      role: "ANALYST",
      status: "ACTIVE",
      name: "Analyst",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    (comparePassword as jest.Mock).mockResolvedValue(true);

    const result = await service.login("analyst@example.com", "Password1");

    expect(result.accessToken).toBe("signed-token");
    expect(result.user.email).toBe("analyst@example.com");
  });

  it("rejects inactive users", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: "user-2",
      email: "viewer@example.com",
      passwordHash: "hashed",
      role: "VIEWER",
      status: "INACTIVE",
      name: "Viewer",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(service.login("viewer@example.com", "Password1")).rejects.toBeInstanceOf(AppError);
  });
});
