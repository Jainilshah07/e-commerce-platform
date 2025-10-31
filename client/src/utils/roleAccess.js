export const menuConfig = {
  public: [
    { key: '/', label: 'Home', path: '/views/public/home' },
    { key: '/login', label: 'Login', path: '/views/public/login' },
  ],

  admin: [
    {
      key: 'userMgmt',
      label: 'User Management',
      children: [
        { key: '/user/sellers', label: 'Add Seller Admins', path: '/views/private/user/add-seller-admin' },
        { key: '/user', label: 'View Users', path: '/views/private/user/view-users' },
      ],
    },
  ],

  seller_admin: [
    {
      key: 'userMgmt',
      label: 'User Management',
      children: [
        { key: '/user/seller-users', label: 'Add Seller Users', path: '/views/private/user/add-seller-users' },
      ],
    },
    {
      key: 'productMgmt',
      label: 'Product Management',
      children: [
        { key: '/products', label: 'My Products', path: '/views/private/products/my-products' },
        { key: '/products/create', label: 'Add Product', path: '/views/private/products/add-product' },
      ],
    },
  ],

  seller_user: [
    {
      key: 'productMgmt',
      label: 'Product Management',
      children: [
        { key: '/products', label: 'My Products', path: '/views/private/products/my-products' },
        { key: '/products/create', label: 'Add Product', path: '/views/private/products/add-product' },
      ],
    },
  ],
};
