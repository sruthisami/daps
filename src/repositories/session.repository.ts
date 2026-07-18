import { prisma } from "@/lib/db";
import { RepositoryDatabaseClient } from "@/lib/dbclient";
import { Prisma, Session } from "@/generated/prisma/client";

export function createSessionRepository(db: RepositoryDatabaseClient = prisma) {
  return {
    create(data: Prisma.SessionCreateInput): Promise<Session> {
      return db.session.create({
        data,
      });
    },

    findByTokenHash(tokenHash: string) {
      return db.session.findUnique({
        where: {
          tokenHash,
        },
        include: {
          user: true,
        },
      });
    },

    deleteByTokenHash(tokenHash: string) {
      //using deleteMany instead of delete to avoid potential race conditions and enforce idempotency
      return db.session.deleteMany({
        where: {
          tokenHash,
        },
      });
    },

    //   deleteExpired() {
    //     return db.session.deleteMany({
    //       where: {
    //         expiresAt: {
    //           lt: new Date(),
    //         },
    //       },
    //     });
    //   },
  };
}

export const sessionRepository = createSessionRepository();
