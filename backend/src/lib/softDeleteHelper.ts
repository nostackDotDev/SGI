import prisma from "./prisma";

export async function softDeleteWithReassign({
  modelUpdate,
  reassignFn,
}: {
  modelUpdate: (tx: any) => Promise<any>;
  reassignFn: (tx: any) => Promise<any>;
}) {
  return prisma.$transaction(async (tx) => {
    await reassignFn(tx);
    return modelUpdate(tx);
  });
}