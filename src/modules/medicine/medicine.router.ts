import { Router } from "express";
import { MedicineController } from "./medicine.controller";


const router = Router();


router.get("/", MedicineController.getAllMedicines);
router.get("/getMedicinesByCategory/:id", MedicineController.getMedicinesByCategory);
router.get("/:id", MedicineController.getMedicineById);
router.get("/categories/all", MedicineController.getAllCategories);









export const medicineRouter: Router = router;
