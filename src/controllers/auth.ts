import { pbkdf2Sync, randomBytes } from "crypto";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../app";
import { config } from "../config/config";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

  try {
    const user = await prisma.user.create({
      data: { email, password: hash, name, salt },
    });

    const tokenExpirationInSeconds = 60 * 60;
    const token = sign({ userId: user.id, email }, config.JWT_SECRET, {
      expiresIn: tokenExpirationInSeconds,
    });

    return res.status(200).send({ token, expiresIn: tokenExpirationInSeconds });
  } catch {
    throw new Error("Failed to create user");
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const hash = pbkdf2Sync(
      password,
      existingUser.salt,
      1000,
      64,
      `sha512`
    ).toString(`hex`);

    if (hash === existingUser.password) {
      const tokenExpirationInSeconds = 60 * 60;
      const token = sign(
        { userId: existingUser.id, email },
        config.JWT_SECRET,
        {
          expiresIn: tokenExpirationInSeconds,
        }
      );
      return res
        .status(200)
        .send({ token, expiresIn: tokenExpirationInSeconds });
    }
  } catch {
    throw new Error("Failed to sign in");
  }
};
