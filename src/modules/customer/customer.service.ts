import { OrderStatus } from "../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

// ===== PROFILE =====
const getProfile = (userId: string) =>
  prisma.user.findUnique({ where: { id: userId } });

const updateProfile = async (userId: string, data: any) => {
  const allowedData = {
    name: data.name,
    email: data.email,
    image: data.image,
  };

  return prisma.user.update({
    where: { id: userId },
    data: allowedData,
  });
};

// ===== ORDERS =====
const getOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { medicine: true } } },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => {
    const totalPrice = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { ...order, totalPrice };
  });
};

const getOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { medicine: true } }, user: true },
  });

  if (!order) throw new Error("Order not found");

  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { ...order, totalPrice };
};

 const createOrder = async (
  userId: string,
  items: { medicineId: string; quantity: number }[],
  address: string,
  name: string,
  phone: string,
) => {
  return prisma.$transaction(async (tx) => {
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });
      if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
      if (medicine.stock < item.quantity)
        throw new Error(`Not enough stock for ${medicine.name}`);

      totalPrice += medicine.price * item.quantity;

      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price,
      });
    }

    for (const item of items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        address,
        name,
        phone,
        items: { create: orderItems },
      },
      include: { items: { include: { medicine: true } } },
    });

    return { ...order, totalPrice };
  });
};

// ===== REVIEWS =====
const addReview = async (
  userId: string,
  medicineId: string,
  rating: number,
  comment: string
) => {
  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { userId_medicineId: { userId, medicineId } },
  });

  if (existingReview) {
    // Update existing review
    return prisma.review.update({
      where: { userId_medicineId: { userId, medicineId } },
      data: { rating, comment },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true } },
      },
    });
  }

  // Create new review if it doesn't exist
  return prisma.review.create({
    data: { userId, medicineId, rating, comment },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true, image: true } },
    },
  });
};


const getReviewsForMedicine = async (medicineId: string) => {
  return prisma.review.findMany({
    where: { medicineId },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          name: true,  // Customer name
          image: true, // Optional avatar
        },
      },
    },
    orderBy: { createdAt: "desc" }, // Latest first
  });
};

const cancelOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== OrderStatus.PLACED) throw new Error("Order already cancelled ");

  // Stock rollback
  for (const item of order.items) {
    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: { stock: { increment: item.quantity } },
    });
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });
};


// ===== EXPORT =====
export const CustomerService = {
  getProfile,
  updateProfile,
  getOrders,
  getOrderById,
  createOrder,
  addReview,
  getReviewsForMedicine,
  cancelOrder 
};
