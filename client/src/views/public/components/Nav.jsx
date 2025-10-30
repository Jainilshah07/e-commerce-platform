import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LoginOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function Nav() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
      children: [
        {
          key: 'add-user',
          label: 'Add User',
        },
        {
          key: 'view-users',
          label: 'View Users',
        },
        {
          key: 'edit-user',
          label: 'Edit User',
        },
        {
          key: 'delete-user',
          label: 'Delete User',
        },
      ],
    },
    {
      key: 'sellers',
      icon: <TeamOutlined />,
      label: 'Seller Management',
      children: [
        {
          key: 'add-seller',
          label: 'Add Seller',
        },
        {
          key: 'view-sellers',
          label: 'View Sellers',
        },
        {
          key: 'seller-users',
          label: 'Seller Users',
        },
      ],
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Product Management',
      children: [
        {
          key: 'add-product',
          label: 'Add Product',
        },
        {
          key: 'view-products',
          label: 'View Products',
        },
        {
          key: 'edit-product',
          label: 'Edit Product',
        },
        {
          key: 'delete-product',
          label: 'Delete Product',
        },
      ],
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Categories',
      children: [
        {
          key: 'add-category',
          label: 'Add Category',
        },
        {
          key: 'view-categories',
          label: 'View Categories',
        },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Login',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const handleMenuClick = (e) => {
    console.log('Menu clicked:', e.key);
    // Add your navigation logic here
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {!collapsed ? (
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              JAINIL'S STORE
            </h2>
          ) : (
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              JS
            </h2>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100vh - 64px)' 
        }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>
          
          <div style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 0'
          }}>
            <Menu
              theme="dark"
              mode="inline"
              items={bottomMenuItems}
              onClick={handleMenuClick}
            />
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 style={{ margin: 0, fontSize: '20px' }}>Admin Dashboard</h1>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <h2>Welcome to your E-commerce Admin Panel</h2>
          <p>Select a menu item from the sidebar to get started.</p>
          
          <div style={{ marginTop: '24px' }}>
            <h3>Quick Stats</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              marginTop: '16px'
            }}>
              <div style={{ 
                padding: '20px', 
                background: '#f0f2f5', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, color: '#1890ff' }}>Total Users</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0' }}>1,234</p>
              </div>
              <div style={{ 
                padding: '20px', 
                background: '#f0f2f5', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, color: '#52c41a' }}>Total Products</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0' }}>567</p>
              </div>
              <div style={{ 
                padding: '20px', 
                background: '#f0f2f5', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, color: '#fa8c16' }}>Active Sellers</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0 0' }}>89</p>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}