import { Notification, User } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import { EmailService } from "./email-service";
import { PushService } from "./push-service";

export class QueueService {
  static readonly NOTIFICATIONS_QUEUE_NAME = "notifications";
  static readonly redisConnection = {
    host: process.env.REDIS_HOST,
    port: 16135,
    password: process.env.REDIS_PASSWORD,
  };
  static readonly notificationsQueue = new Queue(
    QueueService.NOTIFICATIONS_QUEUE_NAME,
    {
      connection: QueueService.redisConnection,
    }
  );

  static startWorker() {
    new Worker(
      QueueService.NOTIFICATIONS_QUEUE_NAME,
      async (job) => {
        if (job.name === "send-email") {
          await EmailService.sendMail(
            job.data.email,
            job.data.title,
            job.data.body
          );
        }

        if (job.name === "send-push") {
          await PushService.sendPushNotification(
            job.data.userId,
            job.data.title,
            job.data.body
          );
        }
      },
      {
        connection: QueueService.redisConnection,
      }
    );
  }

  static async addEmailNotificationJob(
    notification: Notification & { user: User }
  ) {
    await QueueService.notificationsQueue.add(
      "send-email",
      {
        id: notification.id,
        email: notification.user.email,
        title: notification.title,
        body: notification.body,
      },
      { delay: QueueService.getDelayInMs(notification.date.toISOString()) }
    );
  }

  static async addPushNotificationJob(
    notification: Notification & { user: User }
  ) {
    await QueueService.notificationsQueue.add(
      "send-push",
      {
        id: notification.id,
        userId: notification.user.id,
        title: notification.title,
        body: notification.body,
      },
      { delay: QueueService.getDelayInMs(notification.date.toISOString()) }
    );
  }

  private static getDelayInMs(date: string): number {
    return new Date(date).getTime() - new Date().getTime();
  }
}
