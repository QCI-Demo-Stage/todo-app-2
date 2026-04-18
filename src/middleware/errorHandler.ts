import type { NextFunction, Request, Response } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? 500;
  const body: { error: string; details?: unknown } = {
    error: status === 500 ? "Internal Server Error" : err.message,
  };
  if (err.details !== undefined) {
    body.details = err.details;
  }
  res.status(status).json(body);
}
