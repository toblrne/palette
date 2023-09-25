import { Router } from 'express';
import * as likeController from '../controllers/likeController';

const router = Router({ mergeParams: true });

router.post('/', likeController.createLike);
router.delete('/:likeId', likeController.deleteLike);

export default router;
