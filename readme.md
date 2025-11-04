🛍️ E-Commerce Platform

A full-stack e-commerce management platform with role-based access, JWT authentication, and image uploads using Y-M-D structured storage.

Built using React + Redux Toolkit + Ant Design on the frontend and Node.js + Express + MySQL + Sequelize on the backend.

🚀 Features
👤 Authentication & Roles

Secure JWT-based login for all user types.

Roles:

Admin: Manages sellers and platform users.

Seller Admin: Adds and manages seller users.

Seller User: Manages products for their seller.

Role-based UI and routing via ProtectedRoute and menuConfig.

🧩 Product Management

Add, view, update, and delete products.

Multi-image upload (max 3) with Ant Design’s Upload component.

Y-M-D (Year-Month-Day) temp folder upload structure.

Files are first stored in /uploads/temp/YYYY-MM-DD and moved to /uploads/products after product creation.

🖼️ File Upload Flow

Temporary Upload: Images are uploaded to a date-based temp folder.

On Submit: Files are moved to /uploads/products.

Final URLs: Stored in DB for both product and product_images table.

🧾 Product Display

Dynamic product listing page with images, price, and description.

Public view for all users.

Seller-specific “My Products” dashboard.

🧠 State Management

Implemented via Redux Toolkit and redux-persist for session persistence.

Seamless login restore even after page reloads.

🧰 UI/UX

Built with Ant Design v5 and Formik + Yup validation.

Interactive modals, responsive layout, and consistent design.

Automatic navigation post creation or update.

🏗️ Tech Stack
Frontend

React (Vite or CRA)

Redux Toolkit + redux-persist

Ant Design (v5)

Formik + Yup

Axios

React Router DOM v6

Backend

Node.js + Express.js

Sequelize ORM (MySQL)

Multer for file uploads

JWT Authentication

bcrypt for password hashing

Database

MySQL with Sequelize migrations
Tables: users, sellers, products, product_images, categories

🧪 Environment Variables (.env)
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=ecommerce_db
JWT_SECRET=supersecretkey
UPLOAD_DIR=uploads

Client → POST /api/uploads/temp
             ↓
Server saves file to:
  /uploads/temp/2025-11-04/<file>.png
             ↓
User submits product form
             ↓
Server moves file to:
  /uploads/products/<file>.png
             ↓
Product & image URLs saved in DB
