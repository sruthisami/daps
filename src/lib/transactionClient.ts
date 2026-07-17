import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./db";

export type DatabaseClient = typeof prisma | Prisma.TransactionClient;