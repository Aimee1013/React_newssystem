import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, AuditOutlined } from '@ant-design/icons';
import axios from "axios";

const { confirm } = Modal;


export default function NewsDraft (props) {
  const [dataSource, setdataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log('rights', res.data)
      const list = res.data
      setdataSource(res.data)
    })
  }, [username])



  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => <b>{category.title}</b>
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape='circle' icon={<EditOutlined />} onClick={() => {
            props.history.push(`/news-manage/update/${item.id}`)
          }}></Button>
          <Button type="primary" danger shape='circle' icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }}></Button>
          <Button type="primary" shape='circle' icon={<AuditOutlined />} onClick={() => { handleAudit(item.id) }}></Button>
        </div >
      }
    },
  ];


  // 删除草稿箱新闻
  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk () {
        deleteNews(item)
      },
      onCancel () {
        console.log('Cancel')
      },
    });
  };

  const deleteNews = (item) => {
    console.log('OK', item);
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  // 审核草稿箱新闻
  const handleAudit = (id) => {
    axios.patch(`/news/${id}`, { auditState: 1 }).then(res => {
      // 补丁修补成功，跳转到审核列表
      props.history.push('/audit-manage/list')
      notification.info({
        message: '通知',
        description: '你可以跳转到审核列表中查看你的新闻',
        placement: 'bottomRight'
      })
    })
  }


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
