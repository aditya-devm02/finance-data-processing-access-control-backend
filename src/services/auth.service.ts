import { AppError } from "../utils/app-error";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { UserRepository } from "../repositories/user.repository";
import { serializeUser } from "../utils/serializer";

export class AuthService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(403, "User account is inactive", "USER_INACTIVE");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const accessToken = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
      user: serializeUser(safeUser),
    };
  }
}
