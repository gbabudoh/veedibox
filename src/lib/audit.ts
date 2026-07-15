import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export async function logAudit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined }
  });
}
