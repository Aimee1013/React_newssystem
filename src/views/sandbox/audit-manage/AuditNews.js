import axios from "axios"
import React, { useEffect, useState } from 'react'
import { Table, Button, notification } from 'antd';


export default function AuditNews () {
  const [auditNews, setauditNews] = useState([])

  const { username, roleId, region } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'regionadmin',
      '3': 'editor'
    }

    axios.get('/news?auditState=1&_expand=category').then(res => {
      console.log('auditNews', res.data)
      const list = res.data
      // 管理员可以有所有权限，非管理员有对应级别的权限
      setauditNews(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [username, roleId, region])


  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (author) => {
        return <b>{author}</b>
      },
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <b >{category.title}</b>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {<Button type="primary" onClick={() => { handleAudit(item, 2, 1) }}>通过</Button>}
          {<Button type="primary" danger onClick={() => { handleAudit(item, 3, 0) }}>驳回</Button>}
        </div >
      }
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    // 通过，该数据从审核新闻中移除，更新数据到后端
    setauditNews(auditNews.filter(data => data.id != item.id))
    axios.patch(`/news/${item.id}`, { auditState, publishState }).then(res => {
      notification.info({
        message: '通知',
        description: '你可以到新闻列表中查看你的新闻的审核状态',
        placement: 'bottomRight'
      })
    })
    // 驳回
  }

  return (
    <div>
      <Table dataSource={auditNews} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}

