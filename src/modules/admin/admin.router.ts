import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/users/:id", auth(UserRole.ADMIN), AdminController.getUserById);
router.patch(
  "/users/:id",
  auth(UserRole.ADMIN),
  AdminController.updateUserRole,
);

router.get("/medicines", auth(UserRole.ADMIN), AdminController.getAllMedicines);

router.get("/orders", auth(UserRole.ADMIN), AdminController.getAllOrders);

router.get(
  "/categories",
  auth(UserRole.ADMIN),
  AdminController.getAllCategories,
);
router.post("/categories", auth(UserRole.ADMIN), AdminController.addCategory);
router.put(
  "/categories/:id",
  auth(UserRole.ADMIN),
  AdminController.updateCategory,
);
router.delete(
  "/categories/:id",
  auth(UserRole.ADMIN),
  AdminController.deleteCategory,
);
router.patch(
  "/users/ban/:id",
  auth(UserRole.ADMIN),
  AdminController.toggleUserBan,
);
export const AdminRouter = router;
