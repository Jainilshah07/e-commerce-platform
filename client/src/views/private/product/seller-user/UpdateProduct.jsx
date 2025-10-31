import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
  Form as AntForm,
  Input,
  Button,
  Card,
  Upload,
  Modal,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../../Api";
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

const UpdateProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [modal, contextHolder] = Modal.useModal(); // ✅ antd v5 safe modal
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product details once
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        const product = res.data;

        const mappedImages = (product.ProductImages || [])
          .map((img, index) => {
            if (!img.img_url) return null;
            return {
              uid: img.id || `-${index}`,
              name: img.img_url.split("/").pop(),
              status: "done",
              url: `http://localhost:5000${img.img_url}`,
            };
          })
          .filter(Boolean);

        setInitialData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category_id: product.category_id || "",
          images: mappedImages,
        });
      } catch (err) {
        message.error("❌ Error fetching product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // ✅ Handle product update
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category_id", values.category_id);

      (values.images || []).forEach((fileWrapper) => {
        if (fileWrapper.originFileObj) {
          formData.append("images", fileWrapper.originFileObj);
        }
      });

      const res = await api.patch(`/products/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      // ✅ Context-aware Modal
      modal.success({
        title: "Product Updated",
        content: `${values.name} has been updated successfully.`,
        centered: true,
        okText: "Go to My Products",
        onOk: () => navigate("/views/private/products/my-products"),
      });

      console.log("✅ Product Updated:", res.data);
    } catch (err) {
      console.error("❌ Update Error:", err);
      message.error(err.response?.data?.message || "Error updating product");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Show loader while fetching
  if (loading || !initialData) {
    return (
      <Card style={{ maxWidth: 600, margin: "100px auto", textAlign: "center" }}>
        <Spin tip="Loading product details..." />
      </Card>
    );
  }

  return (
    <>
      {contextHolder}
      <Card
        title={`Edit Product: ${initialData.name}`}
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Formik
          enableReinitialize
          initialValues={initialData}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue, isSubmitting, values }) => (
            <Form>
              <AntForm.Item
                label="Product Name"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Field as={Input} name="name" onChange={handleChange} />
              </AntForm.Item>

              <AntForm.Item
                label="Price"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Field as={Input} name="price" onChange={handleChange} />
              </AntForm.Item>

              <AntForm.Item
                label="Description"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Field
                  as={Input.TextArea}
                  name="description"
                  rows={3}
                  onChange={handleChange}
                />
              </AntForm.Item>

              <AntForm.Item
                label="Category ID"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Field as={Input} name="category_id" onChange={handleChange} />
              </AntForm.Item>

              {/* ✅ Image Upload Handling */}
              <AntForm.Item
                label="Product Images"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  maxCount={3}
                  beforeUpload={() => false}
                  fileList={values.images}
                  onChange={({ fileList }) => setFieldValue("images", fileList)}
                  onRemove={(file) => {
                    const newFileList = values.images.filter(
                      (item) => item.uid !== file.uid
                    );
                    setFieldValue("images", newFileList);
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
                  Update Product
                </Button>
              </AntForm.Item>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default UpdateProduct;
