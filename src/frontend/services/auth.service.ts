import { api } from "@/frontend/lib/api";

export type LoginInput = {
  email: string;
};

export const authService = {
  async login(input: LoginInput) {
    const response = await api.post("/auth/login", input);
    return response.data;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};