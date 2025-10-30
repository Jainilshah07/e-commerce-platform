import express from 'express';
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createUser);
router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;

