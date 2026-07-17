import type { User } from "@/generated/prisma/client";
import { AuthenticationError } from "@/errors/authentication.error";
import { sessionRepository } from "@/repositories/session.repository";
import { userRepository } from "@/repositories/user.repository";
import {
  generateSessionToken,
  hashSessionToken,
  SESSION_DURATION_MS,
} from "@/utils/session";
import type { LoginInput } from "@/validations/auth.validation";

export type LoginResult = {
  token: string;
  user: User;
};

export const authService = {
  async login({ email }: LoginInput): Promise<LoginResult> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError("Invalid email.");
    }

    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);

    await sessionRepository.create({
      tokenHash,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return {
      token,
      user,
    };
  },

  async authenticate(token: string): Promise<User> {
    const tokenHash = hashSessionToken(token);

    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AuthenticationError("Invalid session.");
    }

    if (session.expiresAt <= new Date()) {
      await sessionRepository.deleteByTokenHash(tokenHash); //lazy deletion of expired session

      throw new AuthenticationError("Session expired.");
    }

    return session.user;
  },

  async logout(token: string): Promise<void> {
    const tokenHash = hashSessionToken(token);

    await sessionRepository.deleteByTokenHash(tokenHash);
  },
};