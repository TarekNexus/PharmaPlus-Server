import { prisma } from "../../lib/prisma";

// ===== USERS =====
const getAllUsers = () =>
  prisma.user.findMany({ orderBy: { createdAt: "desc" } });


const getUserById = (userId: string) =>
  prisma.user.findUnique({ where: { id: userId } });



const updateUserRole = (userId: string, data: any) => 
  prisma.user.update({ 
    where: { id: userId }, 
    data 
  })


// ===== MEDICINES =====
const getAllMedicines = () =>
  prisma.medicine.findMany({ include: { seller: true, category: true } });

// ===== ORDERS =====
const getAllOrders = () =>
  prisma.order.findMany({
    include: { user: true, items: { include: { medicine: true } } },
    orderBy: { createdAt: "desc" },
  });

const getAllCategories = () => prisma.category.findMany();

const addCategory = (data: any) => prisma.category.create({ data });

const updateCategory = (categoryId: string, data: any) =>
  prisma.category.update({ where: { id: categoryId }, data });

const deleteCategory = async (id: string) => {
 
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }


  return await prisma.category.delete({
    where: { id },
  });
};

const toggleUserBan = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return await prisma.user.update({
    where: { id },
    data: {
      isBanned: !user.isBanned, // 🔄 toggle
    },
  });
};

export const AdminService = {
  getAllUsers,
  updateUserRole,
  getAllMedicines,
  getAllOrders,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getUserById,
   toggleUserBan,
};
