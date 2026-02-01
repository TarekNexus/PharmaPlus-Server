import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";



// Get all orders for the seller's medicines
const getOrders = async (sellerId: string) => {
  return prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId,
          },
        },
      },
    },
    include: {
      
      items: { include: { medicine: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Update order status
const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  user: { id: string; role: string }
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  // 🔐 CUSTOMER RULES
  if (user.role === "CUSTOMER") {
    if (order.userId !== user.id) {
      throw new Error("You can cancel only your own order");
    }

    if (status !== OrderStatus.CANCELLED) {
      throw new Error("Customer can only cancel order");
    }

    if (order.status !== OrderStatus.PLACED) {
      throw new Error("Order cannot be cancelled now");
    }
  }

  // 🔐 SELLER RULES
  if (user.role === "SELLER") {
    if (status === OrderStatus.CANCELLED) {
      throw new Error("Seller cannot cancel order");
    }
  }

  // 🔐 COMMON RULES
  if (
    order.status === OrderStatus.DELIVERED ||
    order.status === OrderStatus.CANCELLED
  ) {
    throw new Error(`Order already ${order.status}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: { include: { medicine: true } },
      user: true,
    },
  });
};


// ===== EXPORT =====
export const OrderService = {
   getOrders,
  updateOrderStatus,
};
