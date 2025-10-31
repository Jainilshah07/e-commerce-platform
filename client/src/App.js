import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './views/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Login from './views/public/Login';
import ProductList from './views/public/ProductList';
import ProductDetail from './views/public/ProductDetail';
import NotFound from './views/NotFound';

// Private pages
import MyProducts from './views/private/product/seller-user/MyProducts';
import AddProduct from './views/private/product/seller-user/AddProduct';
import UpdateProduct from './views/private/product/seller-user/UpdateProduct';
import ViewUsers from './views/private/user/Users';
import AddSeller from './views/private/user/AddSeller';
import AddSellerUser from './views/private/user/AddSellerUser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<ProductList />} />
          <Route path="/views/public/home" element={<ProductList />} />
          <Route path="/views/public/login" element={<Login />} />
          <Route path="/views/public/products/:slug" element={<ProductDetail />} />

          {/* Admin */}
          <Route
            path="/views/private/user/add-seller-admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddSeller />
              </ProtectedRoute>
            }
          />
          <Route
            path="/views/private/user/view-users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ViewUsers />
              </ProtectedRoute>
            }
          />

          {/* Seller Admin */}
          <Route
            path="/views/private/user/add-seller-users"
            element={
              <ProtectedRoute allowedRoles={['seller_admin']}>
                <AddSellerUser />
              </ProtectedRoute>
            }
          />

          {/* Product Management */}
          <Route
            path="/views/private/products/my-products"
            element={
              <ProtectedRoute allowedRoles={['seller_admin', 'seller_user']}>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/views/private/products/add-product"
            element={
              <ProtectedRoute allowedRoles={['seller_admin', 'seller_user']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/views/private/products/update-product/:slug"
            element={
              <ProtectedRoute allowedRoles={['seller_admin', 'seller_user']}>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
