import User from '../models/User.js';
import Seller from '../models/Seller.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

export const createUser = async (req, res) => {
    try {
        const loggedInUser = req.user; // comes from auth middleware
        const { fullname, email, password, role, seller_name, seller_description } = req.body;

        // 🔒 Validate role creation
        if (loggedInUser.role === 'admin' && role === 'seller_admin') {
            // Admin creating a new Seller + Seller Admin

            // 1️⃣ Create Seller
            const seller = await Seller.create({
                name: seller_name || `${fullname}'s Company`,
                description: seller_description || 'Seller registered by Admin'
            });

            // 2️⃣ Create Seller Admin
            const hashedPassword = await bcrypt.hash(password, 10);
            const sellerAdmin = await User.create({
                fullname,
                email,
                password: hashedPassword,
                role: 'seller_admin',
                seller_id: seller.id
            });

            logger.info('✅ Seller and Seller Admin created successfully');

            return res.status(201).json({
                message: 'Seller and Seller Admin created successfully',
                seller: { id: seller.id, name: seller.name },
                user: { id: sellerAdmin.id, email: sellerAdmin.email }
            });
        }

        if (loggedInUser.role === 'seller_admin' && role === 'seller_user') {
            // Seller Admin creating Seller User
            const hashedPassword = await bcrypt.hash(password, 10);
            const sellerUser = await User.create({
                fullname,
                email,
                password: hashedPassword,
                role: 'seller_user',
                seller_id: loggedInUser.seller_id
            });
            logger.info('✅ Seller User created successfully');

            return res.status(201).json({
                message: 'Seller User created successfully',
                user: { id: sellerUser.id, email: sellerUser.email }
            });
        }

        return res.status(403).json({
            message: 'You are not authorized to create this type of user'
        });
    } catch (error) {
        logger.error(`❌ Error creating product: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// READ - Get all users
export const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user;
    let users;

    if (loggedInUser.role === 'admin') {
      users = await User.findAll({
        attributes: ['id', 'fullname', 'email', 'role', 'seller_id'],
      });
    } else if (loggedInUser.role === 'seller_admin') {
      users = await User.findAll({
        where: { seller_id: loggedInUser.seller_id },
        attributes: ['id', 'fullname', 'email', 'role'],
      });
    } else {
      return res.status(403).json({ message: 'You are not authorized to view users' });
    }

    logger.info(`📄 Users fetched by ${loggedInUser.email}`);
    res.json(users);
  } catch (error) {
    logger.error(`❌ Error fetching users: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;
    const { fullname, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Authorization check
    if (
      loggedInUser.role === 'seller_admin' &&
      user.seller_id !== loggedInUser.seller_id
    ) {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    logger.info(`✏️ User ${id} updated by ${loggedInUser.email}`);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    logger.error(`❌ Error updating user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Authorization check
    if (
      loggedInUser.role === 'seller_admin' &&
      user.seller_id !== loggedInUser.seller_id
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }

    await user.destroy(); // soft delete
    logger.info(`🗑️ User ${id} deleted by ${loggedInUser.email}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`❌ Error deleting user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};