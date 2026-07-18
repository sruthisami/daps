import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./db";

export type ServiceDatabaseClient = typeof prisma;

export type RepositoryDatabaseClient =
  | typeof prisma
  | Prisma.TransactionClient;