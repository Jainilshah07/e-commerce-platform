import { Product, ProductImage, Category, Seller } from '../models/index.js';
import slugify from 'slugify';

// CREATE Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    // seller_user's seller_id from token
    const seller_id = req.user.seller_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    // ✅ Validate max 3 images
    if (req.files.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed per product' });
    }

    // ✅ Use first image as main product image
    const mainImageUrl = `/uploads/products/${req.files[0].filename}`;

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      seller_id,
      img_url: mainImageUrl // Main/featured image
    });

    // ✅ Save all images to product_images table
    const images = req.files.map(file => ({
      product_id: product.id,
      img_url: `/uploads/products/${file.filename}`
    }));
    await ProductImage.bulkCreate(images);

    res.status(201).json({ message: '✅ Product created successfully', product });
  } catch (error) {
    console.error('❌ Create Product Error:', error);
    console.log('❌ Create Product Error:', error);
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ - All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ['name'] },
        { model: Seller, attributes: ['name'] },
        { model: ProductImage, attributes: ['img_url'] }
      ]
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
// READ - All Products By Seller_id
export const getProductsBySeller = async (req, res) => {
  try {
    const seller_id = req.user.seller_id; // From authenticated user token
    const products = await Product.findAll({
      where: { seller_id },  
      include: [
        { model: Category, attributes: ['name'] },
        { model: Seller, attributes: ['name'] }, 
        { model: ProductImage, attributes: ['img_url'] }
      ]
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}; 

// READ - Product by Slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      where: { slug },
      include: [
        { model: Category, attributes: ['name'] },
        { model: Seller, attributes: ['name'] },
        { model: ProductImage, as: 'ProductImages', attributes: ['img_url'] }
      ]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // ✅ Check if user is the owner
    if (product.seller_id !== req.user.seller_id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    // ✅ Validate max 3 images if new images are uploaded
    if (req.files && req.files.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed per product' });
    }

    if (name) product.slug = slugify(name, { lower: true, strict: true });

    await product.update({ name, description, price, category_id });

    // ✅ Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from product_images table
      await ProductImage.destroy({ where: { product_id: product.id } });

      // Update main product image (first uploaded image)
      const mainImageUrl = `/uploads/products/${req.files[0].filename}`;
      await product.update({ img_url: mainImageUrl });

      // Save all new images
      const images = req.files.map(file => ({
        product_id: product.id,
        img_url: `/uploads/products/${file.filename}`
      }));
      await ProductImage.bulkCreate(images);
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // ✅ Check if user is the owner
    if (product.seller_id !== req.user.seller_id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    // Delete associated images
    await ProductImage.destroy({ where: { product_id: id } });
    
    // Soft delete product (paranoid: true)
    await product.destroy();

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
