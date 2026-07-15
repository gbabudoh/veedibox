import { prisma } from '@/lib/db/client';

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export type UserOrders = Awaited<ReturnType<typeof getUserOrders>>;

export async function getUserDownloads(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId, status: 'PAID' },
    include: { items: { include: { product: true } } }
  });

  const orderItemIds = orders.flatMap((o) => o.items.map((i) => i.id));
  const tokens = orderItemIds.length
    ? await prisma.downloadToken.findMany({ where: { orderItemId: { in: orderItemIds } }, include: { productFile: true } })
    : [];
  const tokensByOrderItemId = new Map<string, typeof tokens>();
  for (const t of tokens) {
    const list = tokensByOrderItemId.get(t.orderItemId) ?? [];
    list.push(t);
    tokensByOrderItemId.set(t.orderItemId, list);
  }

  return orders.flatMap((o) =>
    o.items.flatMap((item) =>
      (tokensByOrderItemId.get(item.id) ?? []).map((token) => ({ item, file: token.productFile, token }))
    )
  );
}

export type UserDownloads = Awaited<ReturnType<typeof getUserDownloads>>;
