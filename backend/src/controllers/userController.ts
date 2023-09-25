import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        posts: true, // includes the posts of the user
        likes: { include: { post: true } } // includes the liked posts
      }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  // TODO: Implement login logic
  res.status(501).json({ error: "Not implemented" });
};

export const logoutUser = async (req: Request, res: Response) => {
  // TODO: Implement logout logic
  res.status(501).json({ error: "Not implemented" });
};
