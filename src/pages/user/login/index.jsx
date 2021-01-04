import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Form, Input, Button } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';

import LoginForm from './components/Login';
import styles from '../style.less';
// import login from '@/assets/img/login.png';

import { regChar, regUserName, regPassword, regCaptcha } from '@/utils/valid';

// const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;
const FormItem = Form.Item;
const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    const { username, password } = values;
    // if (!isUserName(username) || !isPassword(password)) {
    //   return;
    // }

    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    handleSubmit(values);
  };
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div className={styles.main}>
        <div className={styles.loginBox}>
          <div className={styles.logoBox}>
          </div>
          <div>
            <Form
              name="normal_login"
              className={styles.loginForm}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' },
                  regUserName,regChar
                ]}
              >
                <Input maxLength={30}
                  style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                  bordered={false}
                  size="large"
                  prefix={<div className="icon iconUserName" />}
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }, regPassword]}
              >
                <Input maxLength={30}
                  style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                  size="large"
                  bordered={false}
                  prefix={<div className="icon iconPassword" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              {/* <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#fff' }}>保持回话</Checkbox>
                </Form.Item>
              </Form.Item> */}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={styles.loginFormButton}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
