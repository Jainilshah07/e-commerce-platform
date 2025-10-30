import sequelize from '../config/db.js';
import Product from '../models/Product.js';
import slugify from 'slugify';

const backfillSlug = async () => {
  try {
    const products = await Product.findAll({ where: { slug: null } });

    for (const product of products) {
      const baseSlug = slugify(product.name, { lower: true, strict: true });
      const random = Math.floor(1000 + Math.random() * 9000);
      product.slug = `${baseSlug}-${random}`;
      await product.save();
    }

    console.log(`✅ Slugs added for ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Backfill error:', err);
    process.exit(1);
  }
};

await sequelize.sync(); // just ensures connection
backfillSlug();
