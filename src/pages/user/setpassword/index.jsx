import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined, MailTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Form, Input, Button, Row, Col, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, connect, history } from 'umi';
import { userGetCaptcha, setPassword } from '@/services/login';
import styles from '../style.less';
import { regMobile, regChar, regPassword, regCaptcha, isMobile } from '@/utils/valid';
import login from '@/assets/img/login.png';

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
const _setPassword = async (params) => {
  const result = await setPassword(params)
  console.log(result)
  if (result.success) {
    message.info('修改成功!')
    history.replace('/user/login')
  } else {
    message.error(result.msg)
  }

}
const Login = (props) => {
  const [form] = Form.useForm();
  const [count, setCount] = useState(60);
  const [timing, setTiming] = useState(false);
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;

  const [type, setType] = useState('account');

  const onFinish = values => {
    console.log('Received values of form: ', values);
    // handleSubmit(values)
    _setPassword(values)
  };
  const onGetCaptcha = useCallback(async (mobile) => {
    if (!isMobile(mobile)) {
      return;
    }
    const result = await userGetCaptcha({ mobile, type: 2 });
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
    let value = form.getFieldValue(mode)
    return value
  }
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
              name="newPassword"
              rules={[{ required: true, message: '请输入密码!' }, regPassword,regChar]}
            >
              <Input maxLength={30}
                style={{ borderBottom: '1px solid #fff', color: '#fff' }}
                size="large"
                bordered={false}
                prefix={<div className="icon iconPassword" />}
                type="password"
                placeholder="新密码"

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
            <Form.Item >
              <Button type="primary" htmlType="submit" size="large" className={styles.loginFormButton}>
                提交
              </Button>
              <p style={{ marginTop: 10, marginBottom: 0 }}>
                <Link to={'/user/login'} style={{ color: '#fff' }}>已有账号，去登录？</Link>
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
