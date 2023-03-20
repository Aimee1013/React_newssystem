import React, { useState } from 'react'
import { Layout, theme, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const { Header } = Layout;

function TopHeader (props) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const changeCollapsed = () => {
    console.log('0000', props)
    props.changeCollapsed()
  }

  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token") || '');

  const items = [
    {
      label: <span>{roleName}</span>,
      key: '1',
    },
    {
      label: <div onClick={() => { logout() }}>退出</div>,
      key: '2',
      danger: true,
    }
  ];

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    props.history.replace('/login')
  }

  return (
    <Header style={{
      padding: '0 16px',
      background: colorBgContainer,
    }}>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}

      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

      <div style={{ float: 'right' }}>
        <span>Welcome <span style={{ color: "#1890ff" }}>{username}</span></span>
        <Dropdown menu={{ items }}>
          <Avatar size={35} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>


  )
}

// connent(mapStateToProps,mapDispatchToProps)(被包装的组件)

const mapStateToProps = ({ CollapseReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed () {
    return {
      type: 'change_collaspe'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
