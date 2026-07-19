import { api } from "@/frontend/lib/api";
import type { LoginInput, LoginResponse, User } from "@/frontend/types/auth";

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await api.post("/auth/login", input);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};