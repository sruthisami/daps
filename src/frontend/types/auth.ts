import { UserRole } from "@/generated/prisma/enums";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
};

export type AuthResponse = {
  user: User;
};

export type LoginResponse = {
  user: User;
};