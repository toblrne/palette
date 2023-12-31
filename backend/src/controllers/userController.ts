import { Request, Response } from 'express';
import { sendEmail } from '../util/ses';
import { redis } from '../util/redis'
import { v4 } from "uuid";
import argon2 from "argon2";
import prisma from '../prisma'

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.session!.userId;

  if (!userId) {
    res.status(401).json({ error: "You're not authenticated" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        likes: true,
        comments: true
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};




export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || isNaN(Number(userId))) {
    console.error('userId is missing or invalid');
    return res.status(400).json({ error: 'userId is missing or invalid' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        posts: true,
        likes: { include: { post: true } }
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

  const { email } = req.body;
  try {
    const unhashed = v4();
    const hashed = await argon2.hash(unhashed);

    await redis.set(email, hashed, 'EX', 600);

    await sendEmail({
      recipient: email,
      subject: 'Login Verification',
      body: `<a href="${process.env.API_URL || 'http://localhost:3001'}/users/verify?email=${encodeURIComponent(email)}&token=${unhashed}">Verify</a>`,
    });

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error: "Error during login" });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const { email, token } = req.query;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!email || !token) {
    return res.redirect(`${FRONTEND_URL}/?error=Email and token are required`);
  }

  try {
    const hashedToken = await redis.get(email as string);
    if (!hashedToken) {
      return res.redirect(`${FRONTEND_URL}/?error=Invalid or expired token`);
    }

    const isValid = await argon2.verify(hashedToken, token as string);
    if (!isValid) {
      return res.redirect(`${FRONTEND_URL}/?error=Invalid token`);
    }

    await redis.del(email as string);

    let user = await prisma.user.findUnique({ where: { email: email as string } });
    if (!user) {
      const username = (email as string).split('@')[0];
      user = await prisma.user.create({ data: { email: email as string, username } });
    }

    req.session!.userId = user.id;

    res.redirect(`${FRONTEND_URL}/?login=success`);
  } catch (error) {
    console.error("Error verifying user", error);
    res.redirect(`${FRONTEND_URL}/?error=Error verifying user`);
  }
};


export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session!.destroy((error) => {
      if (error) {
        console.error('Error destroying session:', error);
      }
      res.clearCookie('pale');
      res.json({ log: "out" })
    });
  } catch (error) {
    console.error('Error during logout', error);
    res.status(500).json({ error: 'Error during logout' });
  }
};
