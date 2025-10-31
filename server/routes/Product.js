import express from 'express';
import upload from '../middleware/UploadFiles.js';
import {
  createProduct,
  getProducts,
  getProductsBySeller,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// middleware to allow only seller_user
const allowSellerUser = (req, res, next) => {
  if (req.user.role !== 'seller_user') {
    return res.status(403).json({ message: 'Access denied: only seller users can manage products.' });
  }
  next();
};

// CRUD routes (only for seller_user)
router.post('/', verifyToken, allowSellerUser, upload.array('images', 3), createProduct);
router.patch('/:slug', verifyToken, allowSellerUser, upload.array('images', 3), updateProduct);
router.delete('/:id', verifyToken, allowSellerUser, deleteProduct);
router.get('/seller', verifyToken, getProductsBySeller);

// Public product access
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;