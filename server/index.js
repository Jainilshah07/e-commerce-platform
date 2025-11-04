import express from 'express';
import sequelize from './config/db.js';
import './models/index.js'; // Import models
import cors from 'cors';
import authRoutes from './routes/Auth.js';
import productRoutes from './routes/Product.js'
import userRoutes from './routes/User.js'
import { requestLogger } from './middleware/RequestLogger.js'
import tempUploadRoutes from "./routes/tempUploadRoutes.js";


const app = express();
app.use(cors()); 
app.use(express.json());

app.use(requestLogger); // Added before routes

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use("/api/temp-upload", tempUploadRoutes);


app.use('/uploads', express.static('uploads'));



const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Sync error:', err));