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

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return [];

  // Fetch medicines with category name
  return prisma.medicine.findMany({
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
        select: { name: true } 
      }
    },
    orderBy: { createdAt: "desc" },
  });
};



export const MedicineService = {
  getAllMedicines,
  getMedicineById,
  getAllCategories,
  getMedicinesByCategory,
};
