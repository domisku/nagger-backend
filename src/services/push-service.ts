import { prisma } from "../app";
import * as webpush from "web-push";

export class PushService {
  static async sendPushNotification(
    userId: string,
    title: string,
    body: string
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription) {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expirationTime: subscription.expirationTime,
      };

      try {
        await webpush.sendNotification(
          pushSubscription as any,
          JSON.stringify({
            notification: { title, body },
          })
        );
      } catch (error) {
        throw new Error("Could not send notification");
      }
    }
  }
}
