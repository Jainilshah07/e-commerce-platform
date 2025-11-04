import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Input, Button, Card, message } from "antd";
import api from '../../../Api';
import { useSelector } from "react-redux";
import * as Yup from "yup";

const schema = Yup.object().shape({
    fullname: Yup.string().required("Full Name is Required"),
    email: Yup.string().email('Invalid email').required('Email is Required'),
    password: Yup.string().required("Password is Required")
});

const AddSeller = () => {
    const { user } = useSelector((state) => state.users);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                role: "seller_admin",
            };

            const res = await api.post("/user", payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            message.success("✅ Seller Admin created successfully!");
            console.log("Seller Admin Created:", res.data);
            resetForm();
        } catch (err) {
            console.error("❌ Error:", err);
            message.error(err.response?.data?.message || "Error creating Seller Admin");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Add New Seller Admin" style={{ maxWidth: 600, margin: "0 auto" }}>
            <Formik
                initialValues={{
                    fullname: "",
                    email: "",
                    password: "",
                }}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, setFieldValue, touched, errors, isSubmitting }) => (
                    <Form>
                        <AntForm.Item label="Seller Name" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                            validateStatus={touched.fullname && errors.fullname ? "error" : ""}
                            help={touched.fullname && errors.fullname ? errors.fullname : ""}>
                            <Field as={Input} name="fullname" placeholder="Seller_admin" onChange={handleChange} />
                        </AntForm.Item>

                        <AntForm.Item label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                            validateStatus={touched.email && errors.email ? "error" : ""}
                            help={touched.email && errors.email ? errors.email : ""}>
                            <Field as={Input} name="email" placeholder="seller_admin@gmail.com" onChange={handleChange} />
                        </AntForm.Item>

                        <AntForm.Item label="Password" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                            validateStatus={touched.password && errors.password ? "error" : ""}
                            help={touched.password && errors.password ? errors.password : ""}>
                            <Field
                                as={Input.Password}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </AntForm.Item>

                        <AntForm.Item wrapperCol={{ offset: 6, span: 18 }}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                loading={isSubmitting}
                                block
                                style={{ marginTop: 16 }}
                            >
                                Add Seller Admin
                            </Button>
                        </AntForm.Item>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default AddSeller;
