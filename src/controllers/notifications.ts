import { Notification, User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../app";
import { QueueService } from "../services/queue-service";

export const createNotification = async (req: Request, res: Response) => {
  const { title, body, date, sendPush, sendEmail } = req.body;
  const userId = req.userId;
  let notification: Notification & { user: User };
  try {
    notification = await prisma.notification.create({
      data: { title, body, date, sendPush, sendEmail, userId },
      include: { user: true },
    });
  } catch {
    throw new Error("Could not create notification");
  }

  try {
    if (sendEmail) {
      await QueueService.addEmailNotificationJob(notification);
    }

    if (sendPush) {
      await QueueService.addPushNotificationJob(notification);
    }

    return res.status(201).send({});
  } catch {
    throw new Error("Could not find user");
  }
};

export const subscribeToPush = async (req: Request, res: Response) => {
  const { endpoint, expirationTime, keys } = req.body;

  const activeSub = await prisma.subscription.findUnique({
    where: { endpoint },
  });

  if (activeSub) {
    return res.status(200).send({});
  }

  await prisma.subscription.create({
    data: {
      endpoint,
      expirationTime,
      keys,
      user: { connect: { id: req.userId } },
    },
  });

  return res.status(201).send({});
};

export const listNotifications = async (req: Request, res: Response) => {
  const userId = req.userId;

  const notifications = await prisma.notification.findMany({
    where: { userId, date: { gt: new Date() } },
  });

  return res.status(200).send(notifications);
};

export const deleteNotification = async (req: Request, res: Response) => {
  const userId = req.userId;
  const notificationId = req.params.id;

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { user: true },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.user.id !== userId) {
    throw new Error("You do not have permission to delete this notification");
  }

  await prisma.notification.delete({ where: { id: notificationId } });

  return res.status(200).send({});
};
