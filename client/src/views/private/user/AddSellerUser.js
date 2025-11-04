import React from "react";
import { useFormik } from "formik";
import { Form as AntForm, Input, Button, Card, message } from "antd";
import api from "../../../Api";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const schema = Yup.object().shape({
  fullname: Yup.string().required("Full Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string().required("Password is Required"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});

const AddSellerUser = () => {
  const { user } = useSelector((state) => state.users);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          fullname: values.fullname,
          email: values.email,
          password: values.password,
          role: "seller_user",
          seller_id: user.seller_id,
        };

        const res = await api.post("/user", payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        message.success("✅ Seller User created successfully!");
        console.log("Seller User Created:", res.data);
        resetForm();
      } catch (err) {
        console.error("❌ Error:", err);
        message.error(err.response?.data?.message || "Error creating Seller User");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors, isSubmitting } = formik;

  return (
    <Card title="Add New Seller User" style={{ maxWidth: 600, margin: "0 auto" }}>
      <AntForm onFinish={handleSubmit} layout="horizontal">
        {/* Fullname */}
        <AntForm.Item
          label="Seller User Name"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          validateStatus={touched.fullname && errors.fullname ? "error" : ""}
          help={touched.fullname && errors.fullname ? errors.fullname : ""}
        >
          <Input
            name="fullname"
            placeholder="Seller_user"
            value={values.fullname}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </AntForm.Item>

        {/* Email */}
        <AntForm.Item
          label="Email"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          validateStatus={touched.email && errors.email ? "error" : ""}
          help={touched.email && errors.email ? errors.email : ""}
        >
          <Input
            name="email"
            placeholder="seller_user@gmail.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </AntForm.Item>

        {/* Password */}
        <AntForm.Item
          label="Password"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          validateStatus={touched.password && errors.password ? "error" : ""}
          help={touched.password && errors.password ? errors.password : ""}
        >
          <Input.Password
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </AntForm.Item>

        {/* Confirm Password */}
        <AntForm.Item
          label="Confirm Password"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          validateStatus={touched.cpassword && errors.cpassword ? "error" : ""}
          help={touched.cpassword && errors.cpassword ? errors.cpassword : ""}
        >
          <Input.Password
            name="cpassword"
            placeholder="Confirm Password"
            value={values.cpassword}
            onChange={handleChange}
            onBlur={handleBlur}
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
            Add Seller User
          </Button>
        </AntForm.Item>
      </AntForm>
    </Card>
  );
};

export default AddSellerUser;
