import { authRepository } from "../repositories/auth.repository";
import { createSession } from "@/lib/session";

export class AuthService {
  async login(phone: string) {
    const user = await authRepository.findUser(phone);

    if (!user) {
      return {
        isNewUser: true,
        user: null,
      };
    }

    await createSession({
      userId: user.id,
      phone: user.phone,
    });

    return {
      isNewUser: false,
      user,
    };
  }

  async completeProfile(data: {
    phone: string;
    firstName: string;
    lastName?: string;
  }) {
    const existingUser =
      await authRepository.findUser(data.phone);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user =
      await authRepository.createUser({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      });

    await createSession({
      userId: user.id,
      phone: user.phone,
    });

    return user;
  }

  async logout() {
    const { destroySession } = await import("@/lib/session");
    await destroySession();
  }
}

export const authService = new AuthService();