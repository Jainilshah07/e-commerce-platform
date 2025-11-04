import { Product, ProductImage, Category, Seller } from '../models/index.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { moveFile } from "../utils/fileHelpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE Product

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, temp_files } = req.body;
    const seller_id = req.user.seller_id;

    // validate
    if (!temp_files || temp_files.length === 0)
      return res.status(400).json({ message: "At least one image is required." });

    // Convert string to array if client sends JSON string
    const tempFiles = Array.isArray(temp_files)
      ? temp_files
      : JSON.parse(temp_files);

    // ✅ Move from temp → final
    const finalPaths = [];
    for (const tempPath of tempFiles) {
      const oldPath = path.join(__dirname, "..", tempPath);
      const fileName = path.basename(tempPath);
      const newPath = path.join(__dirname, "..", "uploads", "products", fileName);

      await moveFile(oldPath, newPath);
      finalPaths.push(`/uploads/products/${fileName}`);
    }

    const mainImageUrl = finalPaths[0];

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      seller_id,
      img_url: mainImageUrl,
    });

    const imageRecords = finalPaths.map((img) => ({
      product_id: product.id,
      img_url: img,
    }));
    await ProductImage.bulkCreate(imageRecords);

    res.status(201).json({
      message: "✅ Product created successfully",
      product,
      images: finalPaths,
    });
  } catch (err) {
    console.error("❌ Create Product Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
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
    // const { id } = req.params; //
    const { slug } = req.params;
    const { name, description, price, category_id } = req.body;

    // const product = await Product.findByPk(id); //
    const product = await Product.findOne({ where: { slug } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // ✅ Check if user is the owner
    if (product.seller_id !== req.user.seller_id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    // ✅ Validate max 3 images if new images are uploaded
    if (req.files && req.files.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed per product' });
    }

    // if (name) product.slug = slugify(name, { lower: true, strict: true });

    await product.update({ name, description, price, category_id });

    // ✅ Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      await ProductImage.destroy({ where: { product_id: product.id } });

      // Update main image
      const mainImageUrl = `/uploads/products/${req.files[0].filename}`;
      await product.update({ img_url: mainImageUrl });

      // Save all new images
      const images = req.files.map(file => ({
        product_id: product.id,
        img_url: `/uploads/products/${file.filename}`,
      }));
      await ProductImage.bulkCreate(images);
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('❌ Update Product Error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
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
