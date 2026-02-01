import { Router } from "express";
import { CustomerController } from "./customer.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

// ===== PROFILE =====
router.get("/profile", auth(UserRole.CUSTOMER), CustomerController.getProfile);
router.patch("/profile", auth(UserRole.CUSTOMER), CustomerController.updateProfile);

// ===== ORDERS =====
router.get("/orders", auth(UserRole.CUSTOMER), CustomerController.getOrders);
router.get("/orders/:id", auth(UserRole.CUSTOMER), CustomerController.getOrderById);
router.post("/orders", auth(UserRole.CUSTOMER), CustomerController.createOrder);
router.patch(
  "/orders/:id/cancel",
  auth(UserRole.CUSTOMER),
  CustomerController.cancelOrder
);
// ===== REVIEWS =====
router.post("/reviews", auth(UserRole.CUSTOMER), CustomerController.addReview);
router.get("/reviews/:medicineId", CustomerController.getReviewsForMedicine);

export const CustomerRouter = router;
