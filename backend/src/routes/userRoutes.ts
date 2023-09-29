import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/verify', userController.verifyUser);
router.get('/:userId', userController.getUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

export default router;
