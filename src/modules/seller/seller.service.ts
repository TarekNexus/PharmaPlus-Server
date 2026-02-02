import { prisma } from "../../lib/prisma";

// ===== MEDICINES =====
const addMedicine = async (sellerId: string, data: any) => {
  try {

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error(`Category with id ${data.categoryId} does not exist`);
    }

 
    const medicine = await prisma.medicine.create({
      data: { ...data, sellerId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
       
      },
    });

    // Wrap in your API format
    return {
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    };
  } catch (error) {
    throw error;
  }
};

const updateMedicine = async (sellerId: string, medicineId: string, data: any) => {
  try {
    const result = await prisma.medicine.updateMany({
      where: { id: medicineId, sellerId },
      data,
    });

    if (result.count === 0) {
      throw new Error("Medicine not found or not authorized");
    }

    return {
      success: true,
      message: "Medicine updated successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

const deleteMedicine = async (sellerId: string, medicineId: string) => {
  try {
    const result = await prisma.medicine.deleteMany({
      where: { id: medicineId, sellerId },
    });

    if (result.count === 0) {
      throw new Error("Medicine not found or not authorized");
    }

    return {
      success: true,
      message: "Medicine deleted successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

// ===== EXPORT =====
export const SellerService = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
