import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Input, Button, Card, Upload, message } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import api from '../../../../Api';
import { useSelector } from "react-redux";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  description: Yup.string().required("Required"),
  category_id: Yup.number().required("Required"),
});

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const AddProduct = () => {
  const { user } = useSelector((state) => state.users);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category_id", values.category_id);
      formData.append("seller_id", user.seller_id);

      // ✅ Properly handle image list
      (values.images || []).forEach((fileWrapper) => {
        formData.append("images", fileWrapper.originFileObj);
      });

      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      message.success("✅ Product created successfully!");
      console.log("Product Created:", res.data);
      resetForm();
    } catch (err) {
      console.error("❌ Error:", err);
      message.error(err.response?.data?.message || "Error creating product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add New Product" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Formik
        initialValues={{
          name: "",
          description: "",
          price: "",
          category_id: "",
          images: [],
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, setFieldValue, isSubmitting, values }) => (
          <Form>
            <AntForm.Item label="Product Name" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Field as={Input} name="name" onChange={handleChange} />
            </AntForm.Item>

            <AntForm.Item label="Price" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Field as={Input} name="price" onChange={handleChange} />
            </AntForm.Item>

            <AntForm.Item label="Description" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Field
                as={Input.TextArea}
                name="description"
                rows={3}
                onChange={handleChange}
              />
            </AntForm.Item>

            <AntForm.Item label="Category ID" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Field as={Input} name="category_id" onChange={handleChange} />
            </AntForm.Item>

            {/* ✅ Proper Upload handling */}
            <AntForm.Item label="Product Images" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Upload
                listType="picture-card"
                multiple
                maxCount={3}
                beforeUpload={() => false}
                // Bind the fileList prop to Formik state for display
                fileList={values.images} 
                // Update Formik state on change
                onChange={({ fileList }) => setFieldValue("images", fileList)}
                onPreview={() => {}} // Ant Design requires this for listType="picture-card"
              >
                {/* 🐛 FIX: Render the custom 'uploadButton' component, not a string */}
                {values.images.length >= 3 ? null : uploadButton}
              </Upload>
            </AntForm.Item>

            <AntForm.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button
                htmlType="submit"
                type="primary"
                loading={isSubmitting}
                block
                style={{ marginTop: 16 }}
              >
                Create Product
              </Button>
            </AntForm.Item>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AddProduct;
