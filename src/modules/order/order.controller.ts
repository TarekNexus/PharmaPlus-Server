import { Request, Response } from "express";

import { OrderStatus } from "../../generated/prisma/enums";
import { OrderService } from "./order.service";

// order
const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getOrders(req.user!.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user!; // id + role

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await OrderService.updateOrderStatus(
      id as string,
      status as OrderStatus,
      user
    );

    res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===== EXPORT =====
export const OrderController = {
 
  getOrders,
  updateOrderStatus,
};
