import { Router } from "express";

import auth, { UserRole } from "../../middleware/auth";
import { OrderController } from "./order.controller";

const router = Router();


router.get("/", auth(UserRole.SELLER, UserRole.ADMIN), OrderController.getOrders);
router.patch(
  "/:id",
  auth(UserRole.SELLER, UserRole.ADMIN, UserRole.CUSTOMER),
  OrderController.updateOrderStatus
);

export const OrderRouter: Router = router;
