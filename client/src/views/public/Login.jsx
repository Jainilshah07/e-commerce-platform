import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Form as AntForm, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/UserSlice';
import api from '../../Api';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.post('/auth/login', values);   // expects { token, user }
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
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Login" style={{ width: 400 }}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, isSubmitting }) => (
            <Form>
              <AntForm.Item
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email ? errors.email : ""}
              >
                <Field
                  as={Input}
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </AntForm.Item>

              <AntForm.Item
                validateStatus={touched.password && errors.password ? "error" : ""}
                help={touched.password && errors.password ? errors.password : ""}
              >
                <Field
                  as={Input.Password}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </AntForm.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
