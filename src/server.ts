import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import { UserService } from "./services/user.service";

const userService = new UserService();

const startServer = async () => {
  try {
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

    app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    await prisma.$disconnect();
    process.exit(1);
  }
};

void startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
