export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status = 400
  ) {
    super(message);
  }
}

export class InvalidPhoneError extends AuthError {
  constructor() {
    super("Invalid phone number.", 400);
  }
}

export class InvalidOtpError extends AuthError {
  constructor() {
    super("Invalid OTP.", 401);
  }
}

export class OtpExpiredError extends AuthError {
  constructor() {
    super("OTP expired.", 401);
  }
}

export class TooManyAttemptsError extends AuthError {
  constructor() {
    super("Too many attempts.", 429);
  }
}