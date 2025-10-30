import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import api from '../../../Api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ViewUsers = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/user`);
      setUsers(res.data);
    } catch {
      message.error('Error fetching Users');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    message.success('Product deleted');
    fetchUsers();
  };
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const columns = [
    { title: 'Name', dataIndex: 'fullname', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'price' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Seller ID', dataIndex: 'seller_id', key: 'seller_id' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/products/edit/${record.id}`)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => navigate('/views/private/user/sellers')}
        style={{ marginBottom: 16 }}
      >
        + Add Seller
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default ViewUsers;
