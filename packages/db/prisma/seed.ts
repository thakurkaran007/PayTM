import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'thakurkaran@0345@gmail.com' },
    update: {},
    create: {
      email: 'thakurkaran@0345@gmail.com',
      password: await bcrypt.hash('alice', 10),
      name: 'karan1',
      Balance: {
        create: {
            amount: 20000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "token__1",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'thakurkaran@03456@gmail.com' },
    update: {},
    create: {
      email: 'thakurkaran@03456@gmail.com',
      password: await bcrypt.hash('bob', 10),
      name: 'karan2',
      Balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "token__2",
          provider: "HDFC Bank",
        },
      },
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })