import { prisma } from "@/lib/db";
import { Prisma, Session } from "@/generated/prisma/client";

export const sessionRepository = {
  create(data: Prisma.SessionCreateInput): Promise<Session> {
    return prisma.session.create({
      data,
    });
  },

  findByTokenHash(tokenHash: string) {
    return prisma.session.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });
  },

  deleteByTokenHash(tokenHash: string){
    //using deleteMany instead of delete to avoid potential race conditions and enforce idempotency
    return prisma.session.deleteMany({
      where: {
        tokenHash,
      },
    });
  },

//   deleteExpired() {
//     return prisma.session.deleteMany({
//       where: {
//         expiresAt: {
//           lt: new Date(),
//         },
//       },
//     });
//   },
};