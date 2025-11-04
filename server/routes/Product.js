import express from 'express';
import upload from '../middleware/UploadFiles.js';
import {
  createProduct,
  getProducts,
  getCategories,
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
router.post('/', verifyToken, upload.array('images', 3), createProduct);
router.patch('/:slug', verifyToken, upload.array('images', 3), updateProduct);
router.get('/seller', verifyToken, getProductsBySeller);
router.delete('/:id', verifyToken, allowSellerUser, deleteProduct);


// Public product access
router.get('/', getProducts);
router.get('/getCategories', getCategories);
router.get('/:slug', getProductBySlug);


export default router;