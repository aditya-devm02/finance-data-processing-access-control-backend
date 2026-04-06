require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const bcrypt = require("bcrypt");
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

const demoUsers = [
  {
    name: "System Admin",
    email: process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@finance-backend-demo.local",
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD || "Admin@Md7N8X6d1j2K",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    name: "Aarav Analyst",
    email: "analyst@finance-backend-demo.local",
    password: "Analyst@Demo123",
    role: "ANALYST",
    status: "ACTIVE",
  },
  {
    name: "Vanya Viewer",
    email: "viewer@finance-backend-demo.local",
    password: "Viewer@Demo123",
    role: "VIEWER",
    status: "ACTIVE",
  },
];

const sampleRecords = [
  { amount: 5200, type: "INCOME", category: "Salary", date: "2026-01-05T00:00:00.000Z", description: "January salary" },
  { amount: 1450, type: "EXPENSE", category: "Rent", date: "2026-01-07T00:00:00.000Z", description: "January apartment rent" },
  { amount: 420, type: "EXPENSE", category: "Groceries", date: "2026-01-10T00:00:00.000Z", description: "Weekly grocery run" },
  { amount: 5600, type: "INCOME", category: "Salary", date: "2026-02-05T00:00:00.000Z", description: "February salary" },
  { amount: 950, type: "INCOME", category: "Freelance", date: "2026-02-15T00:00:00.000Z", description: "Backend consulting invoice" },
  { amount: 1510, type: "EXPENSE", category: "Rent", date: "2026-02-07T00:00:00.000Z", description: "February apartment rent" },
  { amount: 610, type: "EXPENSE", category: "Utilities", date: "2026-02-11T00:00:00.000Z", description: "Electricity and internet bills" },
  { amount: 5800, type: "INCOME", category: "Salary", date: "2026-03-05T00:00:00.000Z", description: "March salary" },
  { amount: 1200, type: "INCOME", category: "Investments", date: "2026-03-12T00:00:00.000Z", description: "Dividend and fund redemption" },
  { amount: 1510, type: "EXPENSE", category: "Rent", date: "2026-03-07T00:00:00.000Z", description: "March apartment rent" },
  { amount: 460, type: "EXPENSE", category: "Transport", date: "2026-03-18T00:00:00.000Z", description: "Commute and travel expenses" },
  { amount: 390, type: "EXPENSE", category: "Groceries", date: "2026-03-21T00:00:00.000Z", description: "Weekend grocery purchase" },
];

async function seedUsers() {
  const users = [];

  for (const user of demoUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const savedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash,
        role: user.role,
        status: user.status,
        deletedAt: null,
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        status: user.status,
      },
    });
    users.push(savedUser);
  }

  return users;
}

async function seedRecords(adminUserId) {
  // Replacing only seeded admin-owned records keeps the demo dataset deterministic across repeated runs.
  await prisma.financialRecord.deleteMany({
    where: { createdBy: adminUserId },
  });

  for (const record of sampleRecords) {
    await prisma.financialRecord.create({
      data: {
        amount: new Prisma.Decimal(record.amount),
        type: record.type,
        category: record.category,
        date: new Date(record.date),
        description: record.description,
        createdBy: adminUserId,
      },
    });
  }
}

async function main() {
  const users = await seedUsers();
  const adminUser = users.find((user) => user.role === "ADMIN");

  if (!adminUser) {
    throw new Error("Admin seed user was not created");
  }

  await seedRecords(adminUser.id);

  console.log("Seed completed successfully");
  console.log("Admin:", demoUsers[0].email);
  console.log("Analyst:", demoUsers[1].email);
  console.log("Viewer:", demoUsers[2].email);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
