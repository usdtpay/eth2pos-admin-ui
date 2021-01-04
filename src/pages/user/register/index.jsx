import {
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  MailTwoTone,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Alert, Checkbox, Form, Input, Button, Row, Col, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, connect } from 'umi';
import { userGetCaptcha } from '@/services/login';
import { regMobile, regUserName, regPassword, regCaptcha, isMobile,regChar } from '@/utils/valid';

import login from '@/assets/img/login.png';
import styles from '../style.less';

const FormItem = Form.Item;
const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const [form] = Form.useForm();
  const [count, setCount] = useState(60);

  const [timing, setTiming] = useState(false);
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;

  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/register',
      payload: { ...values },
    });
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    handleSubmit(values);
  };
  const onGetCaptcha = useCallback(async (mobile) => {
    if (!isMobile(mobile)) {
      return;
    }
    const result = await userGetCaptcha({ mobile, type: '1' });

    if (result === false) {
      return;
    }
    message.success(`获取验证码成功！验证码为：${result.data}`);
    setTiming(true);
  }, []);

  useEffect(() => {
    let interval = 0;
    const { countDown } = count;

    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数

            return countDown || 60;
          }

          return preSecond - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing]);

  const getFieldValue = (mode) => {
    const value = form.getFieldValue(mode);
    return value;
  };
  return (
    <div className={styles.main}>
      <div className={styles.loginBox}>
        <div className={styles.logoBox}>
          <img src={login} alt="" className={styles.logo} />
        </div>
        <div>
          <Form
            name="normal_login"
            form={form}
            className={styles.loginForm}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }, regUserName,regChar]}
            >
              <Input maxLength={30}
                style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                bordered={false}
                size="large"
                prefix={<div className="icon iconUserName" />}
                placeholder="用户名必须3-30个字符"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }, regPassword,regChar]}
            >
              <Input maxLength={30}
                style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                size="large"
                bordered={false}
                prefix={<div className="icon iconPassword" />}
                type="password"
                placeholder="密码必须6-30个字符"
              />
            </Form.Item>
            <Form.Item
              name="mobile"
              rules={[{ required: true, message: '请输入手机号!' }, regMobile]}
            >
              <Input maxLength={11}
                style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                size="large"
                bordered={false}
                prefix={<div className="icon iconPhone" />}
                type="text"
                placeholder="手机号"
              />
            </Form.Item>
            <Form.Item shouldUpdate style={{ position: 'relative' }}>

              <Form.Item noStyle name="mobileCaptcha" rules={[regCaptcha]}>
                <Input maxLength={6}
                  style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                  size="large"
                  prefix={<div className="icon iconCaptcha" />}
                  bordered={false}
                  placeholder="短信验证码"
                />
              </Form.Item>
              <div
                type="text"
                className={styles.getCaptcha}
                disabled={timing}
                onClick={() => {
                  const value = getFieldValue('mobile');
                  onGetCaptcha(value);
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}

              </div>

            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className={styles.loginFormButton}
              >
                注册
              </Button>
              <p style={{ marginTop: 10, marginBottom: 0 }}>
                <Link style={{ color: '#fff' }} to="/user/login">
                  已有账号，去登录？
                </Link>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
