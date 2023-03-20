// 自定义的hooks，与组件有差别

import { useEffect, useState } from 'react'
import { notification } from "antd"
import axios from "axios"

const { username } = JSON.parse(localStorage.getItem('token'))

function usePublish (type) {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      console.log('666', res.data)
      setdataSource(res.data)
    })
  }, [username, type])

  const handlePublish = (id) => {
    console.log(id)
    setdataSource(dataSource.filter(item => item.id != id))
    axios.patch(`/news/${id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: '通知',
        description: '该新闻已发布，你可以到发布管理的已发布中查看你的新闻',
        placement: 'bottomRight'
      })
    })
  }

  const handleSunset = (id) => {
    console.log(id)
    setdataSource(dataSource.filter(item => item.id != id))
    axios.patch(`/news/${id}`, {
      publishState: 3,
    }).then(res => {
      notification.info({
        message: '通知',
        description: '该新闻已下线，你可以到发布管理的已下线中查看你的新闻',
        placement: 'bottomRight'
      })
    })
  }

  const handleDelete = (id) => {
    console.log(id)
    setdataSource(dataSource.filter(item => item.id != id))
    axios.delete(`/news/${id}`).then(res => {
      notification.info({
        message: '通知',
        description: '该已下线新闻已删除',
        placement: 'bottomRight'
      })
    })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePublish
