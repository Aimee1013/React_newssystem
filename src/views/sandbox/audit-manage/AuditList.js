import axios from "axios"
import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tag, notification } from 'antd';



export default function AuditList (props) {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  //  _ne是不等于 _lt是小于 _gt是大于 _lte是小于等于 json-server特有的写法 
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      console.log('AuditList', res.data)
      const list = res.data
      setdataSource(list)
    })
  }, [username])


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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <Tag style={{ color: colorList[auditState] }}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {item.auditState === 1 && <Button type="primary" danger onClick={() => { handlePublish(item) }}>发布</Button>}
          {item.auditState === 2 && <Button type="primary" onClick={() => { handleRevert(item) }}>撤销</Button>}
          {item.auditState === 3 && <Button type="primary" onClick={() => { handleUpdate(item) }}>更新</Button>}
        </div >
      }
    },
  ];


  // 处理撤销函数(撤销后，审核状态变为审核中，并移除审核列表，显示在草稿箱中)
  const handleRevert = (item) => {
    // console.log('Revert', item)
    // 1.移除审核列表
    setdataSource(dataSource.filter(data => data.id != item.id))
    // 2.审核状态变为审核中，并更新到后端
    axios.patch(`/news/${item.id}`, { auditState: 0 }).then(res => {
      notification.info({
        message: '通知',
        description: '该新闻已撤销，你可以到草稿箱中查看你的新闻',
        placement: 'bottomRight'
      })
    })
  }

  // 处理更新函数
  const handleUpdate = (item) => {
    // 跳转到更新页面  /news-manage/update/33
    props.history.push(`/news-manage/update/${item.id}`)
  }

  // 处理发布函数(发布状态改为已发布)
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, { publishState: 2 }).then(res => {
      props.history.push('/publish-manage/published')
      notification.info({
        message: '通知',
        description: '该新闻已发布，你可以到发布管理的已发布中查看你的新闻',
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
