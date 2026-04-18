export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details?: unknown) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}
