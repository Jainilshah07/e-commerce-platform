import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Select, Input, Button, Card, Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../../Api";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

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
  const [modal, contextHolder] = Modal.useModal();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/getCategories");
        setCategories(res.data);
      } catch {
        message.error("Error fetching categories");
      } 
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        category_id: values.category_id,
        temp_files: values.temp_files, // 👈 Only temp paths sent
      };

      const res = await api.post("/products", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      modal.success({
        title: "Product Created",
        content: `${values.name} has been created successfully.`,
        okText: "Go to My Products",
        centered: true,
        onOk: () => navigate("/views/private/products/my-products"),
      });

      resetForm();
    } catch (err) {
      console.error("❌ Error:", err);
      message.error(err.response?.data?.message || "Error creating product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTempUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await api.post("/temp-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess(res.data, file); // ✅ Let AntD know upload succeeded
      return res.data.files[0]; // return { filename, temp_path }
    } catch (err) {
      console.error("Upload error:", err);
      onError(err);
    }
  };

  return (
    <>
      {contextHolder}
      <Card title="Add New Product" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Formik
          initialValues={{
            name: "",
            description: "",
            price: "",
            category_id: "",
            images: [],
            temp_files: [],
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
                {/* <Field as={Select} name="category_id" onChange={(value) => setFieldValue('category_id', value)} />
                 */}
                <Select
                  name="category_id"
                  onChange={(value) => setFieldValue("category_id", value)}
                  placeholder="Select a category"
                  value={values.category_id}
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </AntForm.Item>

              {/* ✅ Upload handled via temp-upload */}
              <AntForm.Item label="Product Images" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Upload
                  customRequest={handleTempUpload}
                  listType="picture-card"
                  multiple
                  maxCount={3}
                  onChange={({ fileList }) => {
                    setFieldValue("images", fileList);
                    // extract uploaded file paths
                    const uploadedPaths = fileList
                      .filter(f => f.response && f.response.files)
                      .map(f => f.response.files[0].temp_path);
                    setFieldValue("temp_files", uploadedPaths);
                  }}
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
