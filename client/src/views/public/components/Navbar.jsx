// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { logout } from '../../../store/UserSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between p-4 shadow-md bg-white">
      <div>
        <Link to="/">🛍️ EcomApp</Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.fullname}</span>
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </>
        ) : (
          <Link to="/login">
            <Button type="primary">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;