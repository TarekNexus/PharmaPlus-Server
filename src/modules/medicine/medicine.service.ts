import { prisma } from "../../lib/prisma";

// ===== PUBLIC =====
const getAllMedicines = () =>
  prisma.medicine.findMany({
    include: { category: true, seller: true },
    orderBy: { createdAt: "desc" },
  });

const getMedicineById = (id: string) =>
  prisma.medicine.findUnique({
    where: { id },
    include: { category: true, seller: true },
  });

const getAllCategories = () =>
  prisma.category.findMany({ orderBy: { createdAt: "desc" } });

const getMedicinesByCategory = async (categoryId: string) => {
  // Find category first
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return {
      success: false,
      message: "Category not found",
      categoryName: null,
      data: [],
    };
  }

  // Fetch medicines with nested category
  const medicines = await prisma.medicine.findMany({
    where: { categoryId },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      description: true,
      image: true,
      sellerId: true,
      categoryId: true,
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map medicines to remove nested category object (optional)
  const data = medicines.map(m => ({
    id: m.id,
    name: m.name,
    price: m.price,
    stock: m.stock,
    description: m.description,
    image: m.image,
    sellerId: m.sellerId,
    categoryId: m.categoryId,
  }));

  // Return top-level response
  return {
    success: true,
    message: "Medicines for category fetched successfully",
    categoryName: category.name,
    data,
  };
};

const updateMedicine = async (medicineId: string, data: any) => {
  try {
    const updated = await prisma.medicine.update({
      where: { id: medicineId }, // only by id
      data,
    });
    return updated;
  } catch (error) {
    throw error;
  }
};




export const MedicineService = {
  getAllMedicines,
  getMedicineById,
  getAllCategories,
  getMedicinesByCategory,
  updateMedicine
};
