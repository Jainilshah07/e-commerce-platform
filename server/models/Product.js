import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './Category.js';
import slugify from 'slugify';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  img_url: { // ✅ Make sure this matches your DB column name
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  hooks: {
    beforeValidate: (product) => {
      if (!product.slug && product.name) {
        const baseSlug = slugify(product.name, { lower: true, strict: true });
        const random = Math.floor(1000 + Math.random() * 9000);
        product.slug = `${baseSlug}-${random}`;
      }
    }
  }
});

export default Product;
