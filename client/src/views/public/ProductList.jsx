import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../Api'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin tip="Loading products..." />;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>🛍️ All Products</h2>
      <Row gutter={[16, 16]}>
        {products.length ? (
          products.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8}>
              <Card
                title={p.name}
                extra={<Link to={`/views/public/products/${p.slug}`}>View</Link>}
              >
                <p>{p.description}</p>
                <b>₹{p.price}</b>
              </Card>
            </Col>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </Row>
    </div>
  );
};

export default ProductList;
