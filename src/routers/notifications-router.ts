import express from "express";
import {
  createNotification,
  deleteNotification,
  listNotifications,
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

notificationsRouter.get("/notifications", requireAuth, listNotifications);

notificationsRouter.delete(
  "/notifications/:id",
  requireAuth,
  deleteNotification
);

export default notificationsRouter;
