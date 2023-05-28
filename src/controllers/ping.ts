import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
  console.info("Ping received");

  res.status(200);
};
