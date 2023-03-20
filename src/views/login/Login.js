import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css'
import axios from "axios";





export default function Login (props) {

  const onFinish = (values) => {
    console.log('Success:', values);

    // 向后端发请求，验证用户名密码和管理权限，都正确，通过
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      console.log('yanzheng', res.data)
      if (res.data.length === 0) {
        // 登录失败
        message.error('用户名或密码不正确')
      } else {
        // 否则登陆成功
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  };


  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100%' }}>
      <div className="formContainer">
        <div className="formTitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
