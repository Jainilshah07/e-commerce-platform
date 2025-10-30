import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Card } from 'antd';
import api from '../../../api';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number().required('Required').positive(),
});

const ProductCreate = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.post('/products', values);
      alert('Product created successfully!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add New Product" style={{ maxWidth: 600 }}>
      <Formik
        initialValues={{ name: '', description: '', price: '' }}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              as={Input}
              name="name"
              placeholder="Product name"
              onChange={handleChange}
            />
            {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}

            <Field
              as={Input.TextArea}
              name="description"
              placeholder="Description"
              rows={3}
              onChange={handleChange}
            />
            {errors.description && touched.description && (
              <div className="text-red-500">{errors.description}</div>
            )}

            <Field
              as={Input}
              name="price"
              placeholder="Price"
              type="number"
              onChange={handleChange}
            />
            {errors.price && touched.price && <div className="text-red-500">{errors.price}</div>}

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
              className="mt-3"
            >
              Create Product
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default ProductCreate;
