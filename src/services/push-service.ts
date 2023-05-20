import * as webpush from "web-push";
import { prisma } from "../app";

export class PushService {
  static async sendPushNotification(
    userId: string,
    title: string,
    body: string
  ) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
    });

    if (subscriptions.length > 0) {
      for (const subscription of subscriptions) {
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
          console.log(error);
        }
      }
    }
  }
}
