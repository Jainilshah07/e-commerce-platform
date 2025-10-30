import User from './User.js';
import Seller from './Seller.js';
import Product from './Product.js';
import ProductImage from './Image.js';
import Category from './Category.js';

// Seller ↔ User
Seller.hasMany(User, { foreignKey: 'seller_id' });
User.belongsTo(Seller, { foreignKey: 'seller_id', onDelete: 'CASCADE' });

// Seller ↔ Product
Seller.hasMany(Product, { foreignKey: 'seller_id' });
Product.belongsTo(Seller, { foreignKey: 'seller_id' });

// Product ↔ Category
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product ↔ ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

export { Seller, User, Product, ProductImage, Category };
