import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import api from '../../../../Api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyProducts = () => {
  const { user } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/seller`);
      setProducts(res.data);
    } catch {
      message.error('Error fetching products');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    message.success('Product deleted');
    fetchProducts();
  };

  useEffect(() => {
    if (user?.seller_id) fetchProducts();
  }, [user]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: ['Category', 'name'], key: 'category' },
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
        onClick={() => navigate('/products/create')}
        style={{ marginBottom: 16 }}
      >
        + Add Product
      </Button>
      <Table dataSource={products} columns={columns} rowKey="id" />
    </div>
  );
};

export default MyProducts;
