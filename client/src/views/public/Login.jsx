import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form as AntForm, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/UserSlice';
import api from '../../Api';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is Required'),
  password: Yup.string().required('Password is Required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await api.post('/auth/login', values); // expects { token, user }
        dispatch(loginSuccess(res.data));
        localStorage.setItem('auth', JSON.stringify(res.data));
        message.success(`Welcome, ${res.data.user.fullname}`);
        navigate('/');
      } catch (err) {
        console.error(err);
        message.error(err.response?.data?.message || 'Invalid credentials');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Login" style={{ width: 400 }}>
        <AntForm onFinish={formik.handleSubmit}>
          <AntForm.Item
            validateStatus={formik.touched.email && formik.errors.email ? 'error' : ''}
            help={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
          >
            <Input
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </AntForm.Item>

          <AntForm.Item
            validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
            help={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
          >
            <Input.Password
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </AntForm.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={formik.isSubmitting}
          >
            Login
          </Button>
        </AntForm>
      </Card>
    </div>
  );
};

export default Login;
