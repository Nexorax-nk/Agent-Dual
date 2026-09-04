import prisma from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { OrdersClient } from './OrdersClient';

export default async function Orders() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-8 text-center text-xl font-bold">No user found. Please login.</div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <Navbar />
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
