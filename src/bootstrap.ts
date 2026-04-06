import { env } from "./config/env";
import { logger } from "./config/logger";
import { UserService } from "./services/user.service";

const userService = new UserService();

let bootstrapPromise: Promise<void> | null = null;

export const initializeApplication = async (): Promise<void> => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    if (
      env.BOOTSTRAP_ADMIN_NAME &&
      env.BOOTSTRAP_ADMIN_EMAIL &&
      env.BOOTSTRAP_ADMIN_PASSWORD
    ) {
      await userService.ensureBootstrapAdmin(
        env.BOOTSTRAP_ADMIN_NAME,
        env.BOOTSTRAP_ADMIN_EMAIL,
        env.BOOTSTRAP_ADMIN_PASSWORD,
      );
      logger.info("Bootstrap admin check completed");
    }
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
};
