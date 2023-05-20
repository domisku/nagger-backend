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
exports.QueueService = void 0;
const bullmq_1 = require("bullmq");
const email_service_1 = require("./email-service");
const push_service_1 = require("./push-service");
class QueueService {
    static startWorker() {
        new bullmq_1.Worker(QueueService.NOTIFICATIONS_QUEUE_NAME, (job) => __awaiter(this, void 0, void 0, function* () {
            if (job.name === "send-email") {
                yield email_service_1.EmailService.sendMail(job.data.email, job.data.title, job.data.body);
            }
            if (job.name === "send-push") {
                yield push_service_1.PushService.sendPushNotification(job.data.userId, job.data.title, job.data.body);
            }
        }), {
            connection: QueueService.redisConnection,
        });
    }
    static addEmailNotificationJob(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield QueueService.notificationsQueue.add("send-email", {
                id: notification.id,
                email: notification.user.email,
                title: notification.title,
                body: notification.body,
            }, { delay: QueueService.getDelayInMs(notification.date.toISOString()) });
        });
    }
    static addPushNotificationJob(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            yield QueueService.notificationsQueue.add("send-push", {
                id: notification.id,
                userId: notification.user.id,
                title: notification.title,
                body: notification.body,
            }, { delay: QueueService.getDelayInMs(notification.date.toISOString()) });
        });
    }
    static getDelayInMs(date) {
        return new Date(date).getTime() - new Date().getTime();
    }
}
QueueService.NOTIFICATIONS_QUEUE_NAME = "notifications";
QueueService.redisConnection = {
    host: process.env.REDIS_HOST,
    port: 16135,
    password: process.env.REDIS_PASSWORD,
};
QueueService.notificationsQueue = new bullmq_1.Queue(QueueService.NOTIFICATIONS_QUEUE_NAME, {
    connection: QueueService.redisConnection,
});
exports.QueueService = QueueService;
//# sourceMappingURL=queue-service.js.map