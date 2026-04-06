import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { apiRateLimiter } from "./middleware/rate-limit.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import { apiRoutes } from "./routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(apiRateLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
