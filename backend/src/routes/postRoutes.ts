import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

router.get('/url', postController.getPresignedUrl);
router.get('/user/:userId', postController.getPostsByUser);
router.post('/', postController.createPost);
router.get('/:postId', postController.getPostById);
router.put('/:postId', postController.updatePost);
router.get('/', postController.getAllPosts);
router.delete('/:postId', postController.deletePost);


export default router;
