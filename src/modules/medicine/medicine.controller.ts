import { Request, Response } from "express";
import { MedicineService } from "./medicine.service";

// ===== PUBLIC =====
const getAllMedicines = async (_req: Request, res: Response) => {
  try {
    const medicines = await MedicineService.getAllMedicines();
    res.status(200).json({
      success: true,
      message: "All medicines fetched successfully",
      data: medicines,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
      error: error.message || error,
    });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const medicine = await MedicineService.getMedicineById(req.params.id as string);

    if (!medicine) {
      // Medicine not found
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Medicine found
    res.status(200).json({
      success: true,
      message: "Medicine fetched successfully",
      data: medicine,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicine",
      error: error.message || error,
    });
  }
};


const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await MedicineService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message || error,
    });
  }
};

const getMedicinesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;

    const result = await MedicineService.getMedicinesByCategory(categoryId as string);

    // Send result directly
    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicines by category",
      error: error.message || error,
    });
  }
};
const updateMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await MedicineService.updateMedicine(
      req.params.id as string, // just medicineId
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update medicine",
      error: error.message || error,
    });
  }
};


// ===== EXPORT OBJECT =====
export const MedicineController = {
  getAllMedicines,
  getMedicineById,
  getMedicinesByCategory,
  getAllCategories,
  updateMedicine
};
