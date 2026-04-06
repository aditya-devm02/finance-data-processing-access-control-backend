import { app } from "./app";
import { initializeApplication } from "./bootstrap";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";

const startServer = async () => {
  try {
    await initializeApplication();

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
