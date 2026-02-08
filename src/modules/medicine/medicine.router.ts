import { Router } from "express";
import { MedicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = Router();

router.get("/categories/all", MedicineController.getAllCategories);
router.get("/getMedicinesByCategory/:categoryId", MedicineController.getMedicinesByCategory);
router.get("/:id", MedicineController.getMedicineById);
router.get("/", MedicineController.getAllMedicines);
router.put("/:id",auth(UserRole.SELLER,UserRole.ADMIN), MedicineController.updateMedicine);









export const medicineRouter: Router = router;
