import { PrismaClient } from "@prisma/client";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { initServices } from "./init/init-services";
import { handleErrors } from "./middleware/handle-errors";
import authRouter from "./routers/auth-router";
import notificationsRouter from "./routers/notifications-router";
import pingRouter from "./routers/ping-router";

dotenv.config();

const app = express();
const PORT = 8080;

export const prisma = new PrismaClient();
initServices();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(authRouter, notificationsRouter, pingRouter);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
