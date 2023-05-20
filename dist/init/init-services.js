"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initServices = void 0;
const node_schedule_1 = require("node-schedule");
const webpush = __importStar(require("web-push"));
const app_1 = require("../app");
const config_1 = require("../config/config");
const queue_service_1 = require("../services/queue-service");
function initServices() {
    queue_service_1.QueueService.startWorker();
    webpush.setVapidDetails("mailto:nagger.notifications@gmail.com", config_1.config.VAPID_PUBLIC_KEY, config_1.config.VAPID_PRIVATE_KEY);
    (0, node_schedule_1.scheduleJob)("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
        const notificationsToSend = yield app_1.prisma.notification.findMany({
            where: { date: { gt: new Date() } },
            include: { user: true },
        });
        const queuedNotifications = yield queue_service_1.QueueService.notificationsQueue.getDelayed();
        const areNotificationsSynced = notificationsToSend.every((notification) => queuedNotifications.map((n) => n.data.id).includes(notification.id));
        if (!areNotificationsSynced) {
            console.log("Jobs not synced correctly, repopulating queue");
            yield queue_service_1.QueueService.notificationsQueue.obliterate({ force: true });
            yield repopulateNotificationsQueue(notificationsToSend);
            return;
        }
        console.log("Jobs synced correctly");
    }));
}
exports.initServices = initServices;
function repopulateNotificationsQueue(notifications) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const notification of notifications) {
            if (notification.sendPush) {
                yield queue_service_1.QueueService.addPushNotificationJob(notification);
            }
            if (notification.sendEmail) {
                yield queue_service_1.QueueService.addEmailNotificationJob(notification);
            }
        }
    });
}
//# sourceMappingURL=init-services.js.map