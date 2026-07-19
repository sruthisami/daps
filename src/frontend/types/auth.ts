export enum UserRole {
  AUTHOR = "AUTHOR",
  REVIEWER = "REVIEWER",
  ADMIN = "ADMIN",
  VIEWER = "VIEWER",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  user: User;
};