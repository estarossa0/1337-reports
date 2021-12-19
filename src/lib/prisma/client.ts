import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const reportWithComments = Prisma.validator<Prisma.ReportArgs>()({
  include: { comment: true },
});

export type ReportWithComments = Prisma.ReportGetPayload<
  typeof reportWithComments
>;

export default prisma;
