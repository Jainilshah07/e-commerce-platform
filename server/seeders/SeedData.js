// seeders/seedData.js
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';
import { User, Seller, Category, Product } from '../models/index.js';

const seedData = async () => {
    try {
        // Reset tables safely
        await sequelize.sync({ force: true }); // With CASCADE in associations, no FK errors

        // Admin
        const admin = await User.create({
            fullname: 'System Admin',
            email: 'admin@ecom.com',
            password: await bcrypt.hash('Admin@123', 10),
            role: 'admin',
            seller_id: null
        });

        // Seller (Company)
        const seller = await Seller.create({
            name: 'TechWorld',
            description: 'Electronics and gadgets store'
        });

        // Seller Admin
        const sellerAdmin = await User.create({
            fullname: 'Ravi SellerAdmin',
            email: 'ravi@techworld.com',
            password: await bcrypt.hash('Seller@123', 10),
            role: 'seller_admin',
            seller_id: seller.id
        });

        // Seller Users
        await User.bulkCreate([
            {
                fullname: 'John TechUser',
                email: 'john@techworld.com',
                password: await bcrypt.hash('User@123', 10),
                role: 'seller_user',
                seller_id: seller.id
            },
            {
                fullname: 'Mira TechUser',
                email: 'mira@techworld.com',
                password: await bcrypt.hash('User@123', 10),
                role: 'seller_user',
                seller_id: seller.id
            }
        ]);

        const categories = await Category.bulkCreate([
            { name: 'Electronics' },
            { name: 'Laptops' },
            { name: 'Smartphones' }
        ]);

        // 6️⃣ Sample Products (linked to Seller + Category)
        await Product.bulkCreate([
            {
                name: 'MacBook Pro 16"',
                description: 'Apple M3 Pro laptop',
                price: 2399.99,
                seller_id: seller.id,
                category_id: categories[1].id // Laptops
            },
            {
                name: 'Samsung Galaxy S24',
                description: 'Flagship smartphone from Samsung',
                price: 1299.99,
                seller_id: seller.id,
                category_id: categories[2].id // Smartphones
            }
        ]);

        console.log('✅ Seed data created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};
seedData();

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // 💣 drops and recreates all tables
    console.log('✅ Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
};

// syncDatabase();

