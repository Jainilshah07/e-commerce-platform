import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  img_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'product_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

export default ProductImage;