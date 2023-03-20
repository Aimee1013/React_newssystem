import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";

const { confirm } = Modal;

export default function RightList () {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      console.log('rights', res.data)
      const list = res.data
      list.map(item => {
        if (item.children.length <= 0) return item.children = ''
        return item
      })
      setdataSource(res.data)
    })
  }, [])



  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '权限管理',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='skyblue'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{ textAlign: 'center' }}>
            <Switch checked={item.pagepermisson} onChange={() => { switchMethod(item) }}></Switch>
          </div>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
          </Popover>
          <Button type="primary" danger shape='circle' icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }}></Button>
        </div >
      }
    },
  ];

  const switchMethod = (item) => {
    console.log('switchMethod', item)
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })

    } else {
      axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
    }
  }

  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk () {
        deleteRights(item)
      },
      onCancel () {
        console.log('Cancel')
      },
    });
  };

  const deleteRights = (item) => {
    console.log('OK', item);
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      console.log(item.rightId)

      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }



  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
