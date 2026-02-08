// src/app.ts
import express from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id            String     @id @default(cuid())\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  role          String     @default("CUSTOMER")\n  isBanned      Boolean    @default(false)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  medicines     Medicine[]\n  orders        Order[]\n  reviews       Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  medicines Medicine[]\n}\n\nmodel Medicine {\n  id           String  @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  stock        Int\n  image        String?\n  Manufacturer String?\n  sellerId     String\n  categoryId   String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  seller     User        @relation(fields: [sellerId], references: [id])\n  category   Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  @@index([sellerId])\n  @@index([categoryId])\n}\n\nmodel Order {\n  id      String      @id @default(uuid())\n  userId  String\n  status  OrderStatus @default(PLACED)\n  address String\n  name    String?\n  phone   String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user  User        @relation(fields: [userId], references: [id])\n  items OrderItem[]\n\n  @@index([userId])\n}\n\nmodel OrderItem {\n  id         String @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Float\n\n  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  @@index([orderId])\n  @@index([medicineId])\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int\n  comment String\n\n  userId     String\n  medicineId String\n\n  createdAt DateTime @default(now())\n\n  user     User     @relation(fields: [userId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  @@unique([userId, medicineId])\n  @@index([medicineId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"Manufacturer","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"address","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var OrderStatus = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.FRONTEND_URL],
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/seller/seller.router.ts
import { Router } from "express";

// src/modules/seller/seller.service.ts
var addMedicine = async (sellerId, data) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
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
        description: true,
        Manufacturer: true,
        image: true,
        sellerId: true,
        categoryId: true
      }
    });
    return {
      success: true,
      message: "Medicine added successfully",
      data: medicine
    };
  } catch (error) {
    throw error;
  }
};
var updateMedicine = async (sellerId, medicineId, data) => {
  try {
    const result = await prisma.medicine.updateMany({
      where: { id: medicineId, sellerId },
      data
    });
    if (result.count === 0) {
      throw new Error("Medicine not found or not authorized");
    }
    return {
      success: true,
      message: "Medicine updated successfully",
      data: result
    };
  } catch (error) {
    throw error;
  }
};
var deleteMedicine = async (sellerId, medicineId) => {
  try {
    const result = await prisma.medicine.deleteMany({
      where: { id: medicineId, sellerId }
    });
    if (result.count === 0) {
      throw new Error("Medicine not found or not authorized");
    }
    return {
      success: true,
      message: "Medicine deleted successfully",
      data: result
    };
  } catch (error) {
    throw error;
  }
};
var SellerService = {
  addMedicine,
  updateMedicine,
  deleteMedicine
};

// src/modules/seller/seller.controller.ts
var addMedicine2 = async (req, res) => {
  try {
    const medicine = await SellerService.addMedicine(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add medicine",
      error: error.message || error
    });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const medicine = await SellerService.updateMedicine(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update medicine",
      error: error.message || error
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const result = await SellerService.deleteMedicine(
      req.user.id,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to delete medicine",
      error: error.message || error
    });
  }
};
var SellerController = {
  addMedicine: addMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2
};

// src/middleware/auth.ts
var auth2 = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, isBanned: true, name: true, email: true }
      });
      if (!dbUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: dbUser.role
      };
      if (dbUser.isBanned && dbUser.role !== "ADMIN" /* ADMIN */) {
        return res.status(403).json({ success: false, message: "Your account has been banned" });
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/seller/seller.router.ts
var router = Router();
router.post("/medicines", auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */), SellerController.addMedicine);
router.put("/medicines/:id", auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */), SellerController.updateMedicine);
router.delete("/medicines/:id", auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */), SellerController.deleteMedicine);
var SellerRouter = router;

// src/modules/admin/admin.router.ts
import { Router as Router2 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = () => prisma.user.findMany({ orderBy: { createdAt: "desc" } });
var getUserById = (userId) => prisma.user.findUnique({ where: { id: userId } });
var updateUserRole = (userId, data) => prisma.user.update({
  where: { id: userId },
  data
});
var getAllMedicines = () => prisma.medicine.findMany({ include: { seller: true, category: true } });
var getAllOrders = () => prisma.order.findMany({
  include: { user: true, items: { include: { medicine: true } } },
  orderBy: { createdAt: "desc" }
});
var getAllCategories = () => prisma.category.findMany();
var addCategory = (data) => prisma.category.create({ data });
var updateCategory = (categoryId, data) => prisma.category.update({ where: { id: categoryId }, data });
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  return await prisma.category.delete({
    where: { id }
  });
};
var toggleUserBan = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      isBanned: !user.isBanned
      // 🔄 toggle
    }
  });
};
var AdminService = {
  getAllUsers,
  updateUserRole,
  getAllMedicines,
  getAllOrders,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getUserById,
  toggleUserBan
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (_req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const user = await AdminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateUserRole2 = async (req, res) => {
  try {
    const user = await AdminService.updateUserRole(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User role updated", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getAllMedicines2 = async (_req, res) => {
  try {
    const medicines = await AdminService.getAllMedicines();
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getAllOrders2 = async (_req, res) => {
  try {
    const orders = await AdminService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getAllCategories2 = async (_req, res) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var addCategory2 = async (req, res) => {
  try {
    const category = await AdminService.addCategory(req.body);
    res.status(201).json({ success: true, message: "Category added", data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const category = await AdminService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const category = await AdminService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category
    });
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Category already deleted or not found"
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
var toggleUserBan2 = async (req, res) => {
  try {
    const user = await AdminService.toggleUserBan(req.params.id);
    res.status(200).json({
      success: true,
      message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
      data: user
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserRole: updateUserRole2,
  getAllMedicines: getAllMedicines2,
  getAllOrders: getAllOrders2,
  getAllCategories: getAllCategories2,
  addCategory: addCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  toggleUserBan: toggleUserBan2
};

// src/modules/admin/admin.router.ts
var router2 = Router2();
router2.get("/users", auth_default("ADMIN" /* ADMIN */), AdminController.getAllUsers);
router2.get("/users/:id", auth_default("ADMIN" /* ADMIN */), AdminController.getUserById);
router2.patch(
  "/users/:id",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.updateUserRole
);
router2.get("/medicines", auth_default("ADMIN" /* ADMIN */), AdminController.getAllMedicines);
router2.get("/orders", auth_default("ADMIN" /* ADMIN */), AdminController.getAllOrders);
router2.get(
  "/categories",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.getAllCategories
);
router2.post("/categories", auth_default("ADMIN" /* ADMIN */), AdminController.addCategory);
router2.put(
  "/categories/:id",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.updateCategory
);
router2.delete(
  "/categories/:id",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.deleteCategory
);
router2.patch(
  "/users/ban/:id",
  auth_default("ADMIN" /* ADMIN */),
  AdminController.toggleUserBan
);
var AdminRouter = router2;

// src/modules/customer/customer.router.ts
import { Router as Router3 } from "express";

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/modules/customer/customer.service.ts
var getProfile = (userId) => prisma.user.findUnique({ where: { id: userId } });
var updateProfile = async (userId, data) => {
  const allowedData = {
    name: data.name,
    email: data.email,
    image: data.image
  };
  return prisma.user.update({
    where: { id: userId },
    data: allowedData
  });
};
var getOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { medicine: true } } },
    orderBy: { createdAt: "desc" }
  });
  return orders.map((order) => {
    const totalPrice = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { ...order, totalPrice };
  });
};
var getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { medicine: true } }, user: true }
  });
  if (!order) throw new Error("Order not found");
  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { ...order, totalPrice };
};
var createOrder = async (userId, items, address, name, phone) => {
  return prisma.$transaction(async (tx) => {
    const orderItems = [];
    let totalPrice = 0;
    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId }
      });
      if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
      if (medicine.stock < item.quantity)
        throw new Error(`Not enough stock for ${medicine.name}`);
      totalPrice += medicine.price * item.quantity;
      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price
      });
    }
    for (const item of items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } }
      });
    }
    const order = await tx.order.create({
      data: {
        userId,
        address,
        name,
        phone,
        items: { create: orderItems }
      },
      include: { items: { include: { medicine: true } } }
    });
    return { ...order, totalPrice };
  });
};
var addReview = async (userId, medicineId, rating, comment) => {
  const existingReview = await prisma.review.findUnique({
    where: { userId_medicineId: { userId, medicineId } }
  });
  if (existingReview) {
    return prisma.review.update({
      where: { userId_medicineId: { userId, medicineId } },
      data: { rating, comment },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true } }
      }
    });
  }
  return prisma.review.create({
    data: { userId, medicineId, rating, comment },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true, image: true } }
    }
  });
};
var getReviewsForMedicine = async (medicineId) => {
  return prisma.review.findMany({
    where: { medicineId },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          // Customer name
          image: true
          // Optional avatar
        }
      }
    },
    orderBy: { createdAt: "desc" }
    // Latest first
  });
};
var cancelOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.status !== OrderStatus.PLACED) throw new Error("Order already cancelled ");
  for (const item of order.items) {
    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: { stock: { increment: item.quantity } }
    });
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED }
  });
};
var CustomerService = {
  getProfile,
  updateProfile,
  getOrders,
  getOrderById,
  createOrder,
  addReview,
  getReviewsForMedicine,
  cancelOrder
};

// src/modules/customer/customer.controller.ts
var getProfile2 = async (req, res) => {
  try {
    const profile = await CustomerService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const profile = await CustomerService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Profile updated", data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};
var getOrders2 = async (req, res) => {
  try {
    const orders = await CustomerService.getOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const order = await CustomerService.getOrderById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var createOrder2 = async (req, res) => {
  try {
    const { items, address, name, phone } = req.body;
    const order = await CustomerService.createOrder(req.user.id, items, address, name, phone);
    res.status(201).json({ success: true, message: "Order placed", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to place order", error: error.message });
  }
};
var addReview2 = async (req, res) => {
  try {
    const { medicineId, rating, comment } = req.body;
    const review = await CustomerService.addReview(
      req.user.id,
      medicineId,
      rating,
      comment
    );
    res.status(201).json({
      success: true,
      message: "Review submitted",
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getReviewsForMedicine2 = async (req, res) => {
  try {
    const reviews = await CustomerService.getReviewsForMedicine(
      req.params.medicineId
    );
    res.status(200).json({
      success: true,
      data: reviews.map((r) => ({
        customerName: r.user.name,
        rating: r.rating,
        // Convert number to stars
        comment: r.comment,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var cancelOrder2 = async (req, res) => {
  try {
    const order = await CustomerService.cancelOrder(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var CustomerController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  getOrders: getOrders2,
  getOrderById: getOrderById2,
  createOrder: createOrder2,
  addReview: addReview2,
  getReviewsForMedicine: getReviewsForMedicine2,
  cancelOrder: cancelOrder2
};

// src/modules/customer/customer.router.ts
var router3 = Router3();
router3.get("/profile", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.getProfile);
router3.patch("/profile", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.updateProfile);
router3.get("/orders", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.getOrders);
router3.get("/orders/:id", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.getOrderById);
router3.post("/orders", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.createOrder);
router3.patch(
  "/orders/:id/cancel",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.cancelOrder
);
router3.post("/reviews", auth_default("CUSTOMER" /* CUSTOMER */), CustomerController.addReview);
router3.get("/reviews/:medicineId", CustomerController.getReviewsForMedicine);
var CustomerRouter = router3;

// src/modules/medicine/medicine.router.ts
import { Router as Router4 } from "express";

// src/modules/medicine/medicine.service.ts
var getAllMedicines3 = () => prisma.medicine.findMany({
  include: { category: true, seller: true },
  orderBy: { createdAt: "desc" }
});
var getMedicineById = (id) => prisma.medicine.findUnique({
  where: { id },
  include: { category: true, seller: true }
});
var getAllCategories3 = () => prisma.category.findMany({ orderBy: { createdAt: "desc" } });
var getMedicinesByCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    return {
      success: false,
      message: "Category not found",
      categoryName: null,
      data: []
    };
  }
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
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  const data = medicines.map((m) => ({
    id: m.id,
    name: m.name,
    price: m.price,
    stock: m.stock,
    description: m.description,
    image: m.image,
    sellerId: m.sellerId,
    categoryId: m.categoryId
  }));
  return {
    success: true,
    message: "Medicines for category fetched successfully",
    categoryName: category.name,
    data
  };
};
var updateMedicine3 = async (medicineId, data) => {
  try {
    const updated = await prisma.medicine.update({
      where: { id: medicineId },
      // only by id
      data
    });
    return updated;
  } catch (error) {
    throw error;
  }
};
var MedicineService = {
  getAllMedicines: getAllMedicines3,
  getMedicineById,
  getAllCategories: getAllCategories3,
  getMedicinesByCategory,
  updateMedicine: updateMedicine3
};

// src/modules/medicine/medicine.controller.ts
var getAllMedicines4 = async (_req, res) => {
  try {
    const medicines = await MedicineService.getAllMedicines();
    res.status(200).json({
      success: true,
      message: "All medicines fetched successfully",
      data: medicines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
      error: error.message || error
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const medicine = await MedicineService.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Medicine fetched successfully",
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicine",
      error: error.message || error
    });
  }
};
var getAllCategories4 = async (_req, res) => {
  try {
    const categories = await MedicineService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message || error
    });
  }
};
var getMedicinesByCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await MedicineService.getMedicinesByCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicines by category",
      error: error.message || error
    });
  }
};
var updateMedicine4 = async (req, res) => {
  try {
    const medicine = await MedicineService.updateMedicine(
      req.params.id,
      // just medicineId
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update medicine",
      error: error.message || error
    });
  }
};
var MedicineController = {
  getAllMedicines: getAllMedicines4,
  getMedicineById: getMedicineById2,
  getMedicinesByCategory: getMedicinesByCategory2,
  getAllCategories: getAllCategories4,
  updateMedicine: updateMedicine4
};

// src/modules/medicine/medicine.router.ts
var router4 = Router4();
router4.get("/categories/all", MedicineController.getAllCategories);
router4.get("/getMedicinesByCategory/:categoryId", MedicineController.getMedicinesByCategory);
router4.get("/:id", MedicineController.getMedicineById);
router4.get("/", MedicineController.getAllMedicines);
router4.put("/:id", auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */), MedicineController.updateMedicine);
var medicineRouter = router4;

// src/modules/order/order.router.ts
import { Router as Router5 } from "express";

// src/modules/order/order.service.ts
var getOrders3 = async (sellerId) => {
  return prisma.order.findMany({
    include: {
      items: { include: { medicine: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateOrderStatus = async (orderId, status, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  if (!order) throw new Error("Order not found");
  if (user.role === "CUSTOMER") {
    if (order.userId !== user.id) {
      throw new Error("You can cancel only your own order");
    }
    if (status !== OrderStatus.CANCELLED) {
      throw new Error("Customer can only cancel order");
    }
    if (order.status !== OrderStatus.PLACED) {
      throw new Error("Order cannot be cancelled now");
    }
  }
  if (user.role === "SELLER") {
    if (status === OrderStatus.CANCELLED) {
      throw new Error("Seller cannot cancel order");
    }
  }
  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
    throw new Error(`Order already ${order.status}`);
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: { include: { medicine: true } },
      user: true
    }
  });
};
var OrderService = {
  getOrders: getOrders3,
  updateOrderStatus
};

// src/modules/order/order.controller.ts
var getOrders4 = async (req, res) => {
  try {
    const orders = await OrderService.getOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user;
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }
    const order = await OrderService.updateOrderStatus(
      id,
      status,
      user
    );
    res.status(200).json({
      success: true,
      message: "Order updated",
      data: order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var OrderController = {
  getOrders: getOrders4,
  updateOrderStatus: updateOrderStatus2
};

// src/modules/order/order.router.ts
var router5 = Router5();
router5.get("/", auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */), OrderController.getOrders);
router5.patch(
  "/:id",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */),
  OrderController.updateOrderStatus
);
var OrderRouter = router5;

// src/modules/review/review.router.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var addReview3 = (userId, medicineId, rating, comment) => prisma.review.create({ data: { userId, medicineId, rating, comment } });
var getReviewsForMedicine3 = (medicineId) => prisma.review.findMany({
  where: { medicineId },
  include: { user: true },
  orderBy: { createdAt: "desc" }
});
var ReviewService = {
  addReview: addReview3,
  getReviewsForMedicine: getReviewsForMedicine3
};

// src/modules/review/review.controller.ts
var addReview4 = async (req, res) => {
  const { medicineId, rating, comment } = req.body;
  const review = await ReviewService.addReview(req.user.id, medicineId, rating, comment);
  res.json(review);
};
var getReviewsForMedicine4 = async (req, res) => {
  const reviews = await ReviewService.getReviewsForMedicine(req.params.medicineId);
  res.json(reviews);
};
var ReviewController = {
  addReview: addReview4,
  getReviewsForMedicine: getReviewsForMedicine4
};

// src/modules/review/review.router.ts
var router6 = Router6();
router6.post("/reviews", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.addReview);
router6.get("/reviews/:medicineId", ReviewController.getReviewsForMedicine);
var ReviewRouter = router6;

// src/modules/user/user.router.ts
import { Router as Router7 } from "express";

// src/modules/user/user.service.ts
var getMeFromDB = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isBanned: true,
      createdAt: true
    }
  });
};
var updateMeInDB = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      image: data.image
    }
  });
};
var getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var banUserInDB = async (id, isBanned) => {
  return prisma.user.update({
    where: { id },
    data: { isBanned }
  });
};
var changeUserRoleInDB = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role }
  });
};
var UserService = {
  getMeFromDB,
  updateMeInDB,
  getAllUsersFromDB,
  banUserInDB,
  changeUserRoleInDB
};

// src/modules/user/user.controller.ts
var getMe = async (req, res) => {
  try {
    const user = await UserService.getMeFromDB(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message || error
    });
  }
};
var updateMe = async (req, res) => {
  try {
    const updated = await UserService.updateMeInDB(req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Update me error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      error: error.message || error
    });
  }
};
var getAllUsers3 = async (_req, res) => {
  try {
    const users = await UserService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message || error
    });
  }
};
var banUser = async (req, res) => {
  try {
    const user = await UserService.banUserInDB(
      req.params.id,
      req.body.isBanned
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: `User ${req.body.isBanned ? "banned" : "unbanned"} successfully`,
      data: user
    });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update ban status",
      error: error.message || error
    });
  }
};
var changeRole = async (req, res) => {
  try {
    const user = await UserService.changeUserRoleInDB(
      req.params.id,
      req.body.role
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Change role error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to change user role",
      error: error.message || error
    });
  }
};
var userController = {
  getMe,
  updateMe,
  getAllUsers: getAllUsers3,
  banUser,
  changeRole
};

// src/modules/user/user.router.ts
var router7 = Router7();
router7.get("/me", auth_default(), userController.getMe);
router7.patch("/me", auth_default(), userController.updateMe);
router7.get("/", auth_default("ADMIN" /* ADMIN */), userController.getAllUsers);
router7.patch("/:id/ban", auth_default("ADMIN" /* ADMIN */), userController.banUser);
router7.patch("/:id/role", auth_default("ADMIN" /* ADMIN */), userController.changeRole);
var userRouter = router7;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "PharmaPlus server is running!" });
});
app.use("/api/admin", AdminRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/seller", SellerRouter);
app.use("/api/users", userRouter);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
