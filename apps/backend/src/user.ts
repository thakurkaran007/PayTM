import { db } from '@repo/db/src';

export const getUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    if (!user) {
      console.error(`User with ID ${id} not found.`);
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Database error");
  }
};
