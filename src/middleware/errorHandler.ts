import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpErrors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    const body: {
      status: number;
      message: string;
      details?: unknown;
    } = {
      status: err.statusCode,
      message: err.message,
    };
    if (err.details !== undefined) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  console.error(err);
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  }

  res.status(500).json({
    status: 500,
    message: "Internal server error",
  });
}
