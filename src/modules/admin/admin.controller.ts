import { Request, Response } from "express";
import { AdminService } from "./admin.service";


const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await AdminService.getUserById(req.params.id as string);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await AdminService.updateUserRole(req.params.id as string, req.body);
    res.status(200).json({ success: true, message: "User role updated", data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllMedicines = async (_req: Request, res: Response) => {
  try {
    const medicines = await AdminService.getAllMedicines();
    res.status(200).json({ success: true, data: medicines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await AdminService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCategory = async (req: Request, res: Response) => {
  try {
    const category = await AdminService.addCategory(req.body);
    res.status(201).json({ success: true, message: "Category added", data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await AdminService.updateCategory(req.params.id as string, req.body);
    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await AdminService.deleteCategory(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error: any) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Category already deleted or not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const toggleUserBan = async (req: Request, res: Response) => {
  try {
    const user = await AdminService.toggleUserBan(req.params.id as string);

    res.status(200).json({
      success: true,
      message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const AdminController = {
  getAllUsers,
  getUserById,
  updateUserRole,
  getAllMedicines,
  getAllOrders,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleUserBan
};
