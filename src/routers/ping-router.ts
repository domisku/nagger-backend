import { Router } from "express";
import { ping } from "../controllers/ping";

const pingRouter = Router();

pingRouter.get("/ping", ping);

export default pingRouter;
