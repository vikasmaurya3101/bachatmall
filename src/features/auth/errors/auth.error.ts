export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidOtpError extends AuthError {
  constructor() {
    super("Invalid OTP.");
  }
}

export class OtpExpiredError extends AuthError {
  constructor() {
    super("OTP has expired.");
  }
}

export class TooManyAttemptsError extends AuthError {
  constructor() {
    super("Maximum OTP attempts exceeded.");
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super("User not found.");
  }
}