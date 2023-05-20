"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToPush = exports.createNotification = void 0;
const app_1 = require("../app");
const queue_service_1 = require("../services/queue-service");
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, date, sendPush, sendEmail } = req.body;
    const userId = req.userId;
    let notification;
    try {
        notification = yield app_1.prisma.notification.create({
            data: { title, body, date, sendPush, sendEmail, userId },
            include: { user: true },
        });
    }
    catch (_a) {
        throw new Error("Could not create notification");
    }
    try {
        if (sendEmail) {
            yield queue_service_1.QueueService.addEmailNotificationJob(notification);
        }
        if (sendPush) {
            yield queue_service_1.QueueService.addPushNotificationJob(notification);
        }
        return res.status(201).send({});
    }
    catch (_b) {
        throw new Error("Could not find user");
    }
});
exports.createNotification = createNotification;
const subscribeToPush = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { endpoint, expirationTime, keys } = req.body;
    const activeSub = yield app_1.prisma.subscription.findUnique({
        where: { userId: req.userId },
    });
    if (activeSub) {
        yield app_1.prisma.subscription.delete({ where: { userId: req.userId } });
    }
    yield app_1.prisma.subscription.create({
        data: {
            endpoint,
            expirationTime,
            keys,
            user: { connect: { id: req.userId } },
        },
    });
    return res.status(201).send({});
});
exports.subscribeToPush = subscribeToPush;
//# sourceMappingURL=notifications.js.map