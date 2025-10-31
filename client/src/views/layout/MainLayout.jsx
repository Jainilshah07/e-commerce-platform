import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/UserSlice';
import { menuConfig } from '../../utils/roleAccess';

const { Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);
  const [collapsed, setCollapsed] = useState(false);

  const role = user?.role || 'public';
  const menuItems = menuConfig[role];

  const handleMenuClick = ({ key }) => navigate(key);

  const handleLogout = () => {
    dispatch(logout());
    // navigate('/views/public/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        theme="light"
        width={230}
      >
        {/* Logo / App name */}
        <Link to={`/views/public/home`}><div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : 16,
            fontWeight: 600,
            fontSize: 18,
            color: '#1677ff',
          }}
        >
          🛍️ {collapsed ? '' : 'E-Com Dashboard'}
        </div></Link>

        {/* Dynamic Menu */}
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          onClick={handleMenuClick}
          items={menuItems.map((item) =>
            item.children
              ? {
                key: item.key,
                icon: <AppstoreOutlined />,
                label: item.label,
                children: item.children.map((c) => ({
                  key: c.path,
                  label: c.label,
                  icon: <ShopOutlined />,
                })),
              }
              : {
                key: item.path,
                label: item.label,
                icon: <UserOutlined />,
              }
          )}
        />

        {/* Footer (Login / Logout) */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 0,
            width: '100%',
            textAlign: 'center',
            borderTop: '1px solid #f0f0f0',
            paddingTop: 10,
            zIndex: 100,
          }}
        >
          {user ? (
            <div>
              {!collapsed && (
                <div style={{ marginBottom: 8, fontSize: 15, fontWeight:'bolder', color: '#484848ff' }}> 
                  <div style={{ marginBottom: 8, fontSize: 15, fontWeight: 'bold', color: '#484848ff' }}>
                    Welcome 
                  </div>
                   {user.fullname}
                </div>
              )}
              <Button
                icon={<LogoutOutlined />}
                type="link"
                onClick={handleLogout}
                style={{ color: '#d4380d' }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              icon={<LoginOutlined />}
              type="link"
              onClick={() => navigate('/views/public/login')}
            >
              Login
            </Button>
          )}
        </div>
      </Sider>

      {/* Right Content */}
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet /> {/* renders nested route content */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
