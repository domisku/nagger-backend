import express from "express";
import {
  createNotification,
  subscribeToPush,
} from "../controllers/notifications";
import { requireAuth } from "../middleware/require-auth";
import {
  createNotificationValidator,
  pushSubscriptionValidator,
} from "../validators/notifications";

const notificationsRouter = express.Router();

notificationsRouter.post(
  "/create",
  requireAuth,
  createNotificationValidator,
  createNotification
);

notificationsRouter.post(
  "/subscribe",
  requireAuth,
  pushSubscriptionValidator,
  subscribeToPush
);

export default notificationsRouter;
