import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from "../../components/sandbox/NewsRouter"

// 从nprogress模块中引入进度条插件
import Nprogress from "nprogress";
// 引入进度条的样式
import 'nprogress/nprogress.css'

import './NewsSandBox.css'

import { Layout, theme } from 'antd';
const { Content } = Layout;

export default function NewsSandBox () {
  // 开始执行进度条
  Nprogress.start()

  useEffect(() => {
    // 进度条执行结束
    Nprogress.done()
  })

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
