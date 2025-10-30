import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Carousel, Typography, Spin } from 'antd';
import api from '../../Api';

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!product) return <p>Product not found</p>;

  return (
    <Card style={{ maxWidth: 900, margin: '0 auto', backgroundColor: '#9f9f9fff', padding: 0 }}>
      <Carousel arrows={true} >
        {product.ProductImages?.length ? (
          product.ProductImages.map((img) => (
            <div key={img.id}>
              <img
                src={`http://localhost:5000${img.img_url}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '450px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
          ))
        ) : (
          <div>No images available</div>
        )}
      </Carousel>

      <Title level={3} style={{ marginTop: 20 }}>
        {product.name}
      </Title>
      <Paragraph>{product.description}</Paragraph>
      <Paragraph>
        <b>Price:</b> ₹{product.price}
      </Paragraph>
      <Paragraph>
        <b>Category:</b> {product.Category?.name || 'Uncategorized'}
      </Paragraph>
      <Paragraph>
        <b>Seller:</b> {product.Seller?.name || 'N/A'}
      </Paragraph>
    </Card>
  );
};

export default ProductDetail;
