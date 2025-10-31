import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Input, Button, Modal, Card, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../../Api";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [modal, contextHolder] = Modal.useModal(); // ✅ new antd v5 hook

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category_id", values.category_id);
      formData.append("seller_id", user.seller_id);

      (values.images || []).forEach((fileWrapper) => {
        formData.append("images", fileWrapper.originFileObj);
      });

      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      // ✅ New proper modal way (works with context + theming)
      modal.success({
        title: "Product Added",
        content: `${values.name} has been created successfully.`,
        centered: true,
        okText: "Go to My Products",
        onOk: () => {
          resetForm();
          navigate("/views/private/products/my-products");
        },
      });

      console.log("Product Created:", res.data);
    } catch (err) {
      console.error("❌ Error:", err);
      message.error(err.response?.data?.message || "Error creating product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder} {/* ✅ Must be rendered in JSX for modal to work */}
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

              <AntForm.Item label="Product Images" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Upload
                  listType="picture-card"
                  multiple
                  maxCount={3}
                  beforeUpload={() => false}
                  fileList={values.images}
                  onChange={({ fileList }) => setFieldValue("images", fileList)}
                  onPreview={() => {}}
                >
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
    </>
  );
};

export default AddProduct;
