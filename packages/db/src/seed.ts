import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUser() {
  const email = "thakurkaran0345@gmail.com";
  const password = "karnt";
  const name = "Karan";
  const role = "USER"; // must match UserRole enum

  // Create User
  const result = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `
    INSERT INTO "User" (id, email, password, name, role)
    VALUES (gen_random_uuid(), $1, $2, $3, $4::"UserRole")
    RETURNING id;
    `,
    email,
    password,
    name,
    role
  );

  const userId = result[0]?.id;
  console.log("Created User with ID:", userId);

  // Create OnRampTransaction
  const status = "Processing"; // OnRamp enum value
  const token = "token_abc123";
  const provider = "Stripe";
  const amount = 10000;
  const startTime = new Date();

  const onRampResult = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `
    INSERT INTO "OnRampTransaction" (id, status, token, provider, amount, "startTime", "userId")
    VALUES (gen_random_uuid(), $1::"OnRamp", $2, $3, $4, $5, $6)
    RETURNING id;
    `,
    status,
    token,
    provider,
    amount,
    startTime,
    userId
  );

  console.log("Created OnRampTransaction with ID:", onRampResult[0]?.id);
}

seedUser()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
