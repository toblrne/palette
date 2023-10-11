import { Request, Response } from 'express';
import prisma from '../prisma'

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      include: { user: true }
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId: Number(postId)
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment", error);
    res.status(500).json({ error: "Error creating comment" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content }
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error updating comment", error);
    res.status(500).json({ error: "Error updating comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await prisma.comment.findUnique({ where: { id: Number(commentId) } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    await prisma.comment.delete({ where: { id: Number(commentId) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
};
