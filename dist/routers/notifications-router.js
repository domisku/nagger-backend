"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notifications_1 = require("../controllers/notifications");
const require_auth_1 = require("../middleware/require-auth");
const notifications_2 = require("../validators/notifications");
const notificationsRouter = express_1.default.Router();
notificationsRouter.post("/create", require_auth_1.requireAuth, notifications_2.createNotificationValidator, notifications_1.createNotification);
notificationsRouter.post("/subscribe", require_auth_1.requireAuth, notifications_2.pushSubscriptionValidator, notifications_1.subscribeToPush);
exports.default = notificationsRouter;
//# sourceMappingURL=notifications-router.js.map