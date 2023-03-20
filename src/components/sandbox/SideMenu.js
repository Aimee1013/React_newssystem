import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';

import './index.css'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";

import {
  UserOutlined,
  UsergroupAddOutlined,
  UnlockOutlined,
  BankOutlined,
  SendOutlined,
  ShakeOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import axios from "axios";

const { Sider } = Layout;

const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UsergroupAddOutlined />,
  '/user-manage/list': <UsergroupAddOutlined />,
  '/right-manage': <UnlockOutlined />,
  '/right-manage/role/list': <UnlockOutlined />,
  '/right-manage/right/list': <UnlockOutlined />,
  '/news-manage': <SendOutlined />,
  '/news-manage/add': <SendOutlined />,
  '/news-manage/list': <SendOutlined />,
  '/news-manage/draft': <SendOutlined />,
  '/news-manage/category': <SendOutlined />,
  '/audit-manage': <ShakeOutlined />,
  '/audit-manage/audit': <ShakeOutlined />,
  '/audit-manage/list': <ShakeOutlined />,
  '/publish-manage': <TrophyOutlined />,
  '/publish-manage/unpublished': <TrophyOutlined />,
  '/publish-manage/published': <TrophyOutlined />,
  '/publish-manage/sunset': <TrophyOutlined />,
}

function getItem (label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


function SideMenu (props) {
  const [menu, setmenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log('111', res.data)
      setmenu(res.data)
    })
  }, [])

  const [collapsed, setCollapsed] = useState(false);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))

  function getMenu (menu) {
    return menu.map(item => {
      if (item.pagepermisson === 1 && rights.includes(item.key)) {
        return getItem(
          item.label, item.key, iconList[item.key], item.children && item.children.length > 0 ? getMenu(item.children) : ''
        )
      }
    })
  }

  console.log('0', props.location.pathname)
  // '/right-manage/role/list'.split('/')
  // ['', 'right-manage', 'role', 'list']
  // '/right-manage/role/list'.split('/')[1]
  // 'right-manage'

  // const selectedKeys = props.location.pathname === '/' ? ['/home'] : [props.location.pathname]
  const selectedKeys = props.location.pathname
  const openKeys = ['/' + props.location.pathname.split('/')[1]]
  console.log(openKeys)

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="logo" >全球新闻发布系统</div>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <Menu
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            items={getMenu(menu)}
            onClick={(e) => {
              console.log(e.key)
              props.history.push(e.key)
            }} />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ CollapseReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(withRouter(SideMenu))