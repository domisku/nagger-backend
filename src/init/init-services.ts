import { Notification, User } from "@prisma/client";
import { scheduleJob } from "node-schedule";
import * as webpush from "web-push";
import { prisma } from "../app";
import { QueueService } from "../services/queue-service";

export function initServices(): void {
  QueueService.startWorker();
  webpush.setVapidDetails(
    "mailto:nagger.notifications@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  scheduleJob("0 0 * * *", async () => {
    const notificationsToSend = await prisma.notification.findMany({
      where: { date: { gt: new Date() } },
      include: { user: true },
    });

    const queuedNotifications =
      await QueueService.notificationsQueue.getDelayed();

    const areNotificationsSynced = notificationsToSend.every((notification) =>
      queuedNotifications.map((n) => n.data.id).includes(notification.id)
    );

    if (!areNotificationsSynced) {
      console.log("Jobs not synced correctly, repopulating queue");
      await QueueService.notificationsQueue.obliterate({ force: true });
      await repopulateNotificationsQueue(notificationsToSend);
      return;
    }

    console.log("Jobs synced correctly");
  });
}

async function repopulateNotificationsQueue(
  notifications: (Notification & { user: User })[]
) {
  for (const notification of notifications) {
    if (notification.sendPush) {
      await QueueService.addPushNotificationJob(notification);
    }

    if (notification.sendEmail) {
      await QueueService.addEmailNotificationJob(notification);
    }
  }
}
