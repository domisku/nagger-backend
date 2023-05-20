import { PrismaClient } from "@prisma/client";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { initServices } from "./init/init-services";
import { handleErrors } from "./middleware/handle-errors";
import authRouter from "./routers/auth-router";
import notificationsRouter from "./routers/notifications-router";
import { QueueService } from "./services/queue-service";

dotenv.config();

const app = express();
const PORT = 3000;

console.log(QueueService.redisConnection);

export const prisma = new PrismaClient();
initServices();

app.use(cors());
app.use(express.json());
app.use(authRouter, notificationsRouter);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
