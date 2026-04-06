import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ],
});

prisma.$on("query", (event) => {
  logger.debug("Prisma query executed", {
    duration: event.duration,
    query: event.query,
    params: event.params,
  });
});
