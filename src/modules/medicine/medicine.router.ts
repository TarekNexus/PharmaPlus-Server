import { Router } from "express";
import { MedicineController } from "./medicine.controller";


const router = Router();


router.get("/", MedicineController.getAllMedicines);
router.get("/:id", MedicineController.getMedicineById);
router.get("/categories/all", MedicineController.getAllCategories);
router.get("/medicinesCategory/:categoryId", MedicineController.getMedicinesByCategory);








export const medicineRouter: Router = router;
