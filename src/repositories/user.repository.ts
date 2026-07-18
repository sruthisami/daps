import { prisma } from "@/lib/db";
import { RepositoryDatabaseClient } from "@/lib/dbclient";

export function createUserRepository(db: RepositoryDatabaseClient = prisma) {
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
