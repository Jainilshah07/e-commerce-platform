// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './views/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { App as AntApp } from 'antd';

// Public pages
import ProductList from './views/public/ProductList';
// import ProductDetail from './views/public/ProductDetail';
import Login from './views/public/Login';
import ProductDetail from './views/public/ProductDetail';
import MyProducts from './views/private/product/seller-user/MyProducts';
import AddProduct from './views/private/product/seller-user/AddProduct';

// Private pages
// import SellerAdmins from './views/private/Users/SellerAdmins';
// import SellerUsers from './views/private/Users/SellerUsers';
// import ProductCreate from './views/private/Products/ProductCreate';
import NotFound from './views/NotFound';
import ViewUsers from './views/private/user/Users';

const App = () => {
  return (
    <Router>
      <AntApp>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route path="/" element={<ProductList />} />
            <Route path="/views/public/home" element={<ProductList />} />
            <Route path="/views/public/login" element={<Login />} />
            <Route path="/views/public/products/:slug" element={<ProductDetail />} />

            {/* Admin */}
            <Route
              path="/views/private/user/sellers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  {/* <SellerAdmins /> */}
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
              path="/user/seller-users"
              element={
                <ProtectedRoute allowedRoles={['seller_admin']}>
                  {/* <SellerUsers /> */}
                </ProtectedRoute>
              }
            />

            {/* Product Management (Seller Admin + Seller User) */}
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
                  {/* <ProductCreate /> */}
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AntApp>
    </Router>
  );
};

export default App;
