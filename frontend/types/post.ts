import { Comment } from './comment';
import { Like } from './like';

export interface Post {
  id: number;
  imageUrl: string;
  caption?: string;
  userId: number;
  likes: Like[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
