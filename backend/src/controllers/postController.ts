import { Request, Response } from 'express';
import { getSignedUrl } from '../util/s3';
import prisma from '../prisma';

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.query;
    if (typeof fileName !== 'string' || typeof fileType !== 'string') {
      return res.status(422).send("Invalid fileName or fileType");
    }
    const { signedUrl, url } = await getSignedUrl({ fileName, fileType });
    res.status(200).json({ presignedURL: signedUrl, url });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    res.status(500).json({ error: "Error generating presigned URL" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId, imageUrl, caption } = req.body;
    if (typeof userId !== 'number' || typeof imageUrl !== 'string') {
      return res.status(422).send("Invalid userId or imageUrl");
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) return res.status(404).json({ error: "User not found" });

    const post = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).json({ error: "Error creating post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;

    const posts = await prisma.post.findMany({
      skip: skip,  // use the 'skip' value directly
      take: limit,
      orderBy: {
        createdAt: 'desc' // latest posts first
      },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts", error);
    res.status(500).json({ error: "Error getting posts" });
  }
};



export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting post", error);
    res.status(500).json({ error: "Error getting post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const { caption } = req.body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: { caption },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post", error);
    res.status(500).json({ error: "Error updating post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    await prisma.post.delete({ where: { id: postId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post", error);
    res.status(500).json({ error: "Error deleting post" });
  }
};


export const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;  // default to 9 posts if not provided

    if (isNaN(userId)) return res.status(400).json({ error: "Invalid User ID" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'desc' // latest posts first
      },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
      skip: skip,
      take: limit,
    });

    // Return both the posts and the username, even if the posts array is empty
    res.status(200).json({
      username: user.username,
      posts: posts
    });
  } catch (error) {
    console.error("Error getting posts by user", error);
    res.status(500).json({ error: "Error getting posts by user" });
  }
};

export const getLikedPostsByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;

    if (isNaN(userId)) return res.status(400).json({ error: "Invalid User ID" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
      skip: skip,
      take: limit,
    });

    res.status(200).json({
      username: user.username,
      posts: likedPosts
    });
  } catch (error) {
    console.error("Error getting liked posts by user", error);
    res.status(500).json({ error: "Error getting liked posts by user" });
  }
};