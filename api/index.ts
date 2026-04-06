import { Request, Response } from "express";
import { app } from "../src/app";
import { initializeApplication } from "../src/bootstrap";

export default async function handler(req: Request, res: Response) {
  await initializeApplication();
  return app(req, res);
}
