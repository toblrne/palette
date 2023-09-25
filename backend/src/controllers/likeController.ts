import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const like = await prisma.like.create({
      data: {
        userId,
        postId: Number(postId)
      }
    });
    res.status(201).json(like);
  } catch (error) {
    console.error("Error creating like", error);
    res.status(500).json({ error: "Error creating like" });
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const { likeId } = req.params;
    await prisma.like.delete({
      where: { id: Number(likeId) }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting like", error);
    res.status(500).json({ error: "Error deleting like" });
  }
};
