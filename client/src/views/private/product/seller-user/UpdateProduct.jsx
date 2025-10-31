import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 1. Import useParams and useNavigate
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Input, Button, Card, Upload, message, Spin } from "antd"; // 2. Import Spin
import { PlusOutlined } from "@ant-design/icons";
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

const UpdateProduct = () => {
    const { slug } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);

    // State to hold fetched initial product data
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${slug}`);
                const product = res.data;
                const mappedImages = (product.ProductImages || []).map((img, index) => {
                    const imageUrl = img.img_url;

                    if (!imageUrl) return null;

                    return {
                        uid: img.id || `-${index}`,
                        name: imageUrl.split('/').pop(),
                        status: 'done',
                        url: `http://localhost:5000${imageUrl}`,
                    };
                }).filter(Boolean);

                setInitialData({
                    images: mappedImages,
                });

                setInitialData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price || "",
                    category_id: product.category_id || "",
                    images: mappedImages,
                });
            } catch (err) {
                message.error("Error fetching product data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    // 6. Modified handleSubmit for EDIT (PUT/PATCH)
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

            message.success("✅ Product updated successfully!");
            navigate('/views/private/products/my-products');
        } catch (err) {
            console.error("❌ Error:", err);
            message.error(err.response?.data?.message || "Error updating product");
        } finally {
            setSubmitting(false);
        }
    };

    // Show loading indicator while fetching data
    if (loading || !initialData) {
        return <Card style={{ maxWidth: 600, margin: "100px auto" }}><Spin tip="Loading product details..." /></Card>;
    }

    // 8. The Form UI remains largely the same
    return (
        <Card title={`Edit Product: ${initialData.name}`} style={{ maxWidth: 600, margin: "0 auto" }}>
            <Formik
                initialValues={initialData} // Use fetched data
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
                                onRemove={(file) => {
                                    const newFileList = values.images.filter((item) => item.uid !== file.uid);
                                    setFieldValue("images", newFileList);
                                }}
                                onPreview={() => { }}
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
                                Update Product {/* Changed button text */}
                            </Button>
                        </AntForm.Item>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default UpdateProduct;