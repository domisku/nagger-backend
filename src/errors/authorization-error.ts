export class AuthorizationError extends Error {
  readonly statusCode = 401;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
