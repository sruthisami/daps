import { prisma } from "@/lib/db";
import { DatabaseClient } from "@/lib/transactionClient";

export function createUserRepository(
  db: DatabaseClient = prisma
) {
  return {
    findById(id: string) {
      return db.user.findUnique({
        where: { id },
      });
    },

    findByEmail(email: string) {
      return db.user.findUnique({
        where: { email },
      });
    },
  };
}

export const userRepository = createUserRepository();