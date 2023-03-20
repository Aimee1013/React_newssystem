import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from "axios";
import { contentQuotesLinter } from "@ant-design/cssinjs/lib/linters";

const { confirm } = Modal

export default function RoleList () {
  const [dataSource, setdataSource] = useState([])
  const [rightsList, setrightsList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => { return <b>{id}</b> }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape='circle' icon={<EditOutlined />} onClick={() => {
            setIsModalOpen(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }}></Button>
          <Button type="primary" danger shape='circle' icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }}></Button>
        </div>
      }
    }
  ];

  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk () {
        deleteRoles(item)
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  };

  const deleteRoles = (item) => {
    console.log('ok');
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  useEffect(() => {
    axios.get('/roles').then(res => {
      console.log('roles', res.data)
      setdataSource(res.data)
    })

    axios.get('/rights?_embed=children').then(res => {
      res.data.forEach(item => {
        item.title = item.label
        if (item.children.length > 0) {
          item.children.forEach(c => {
            c.title = c.label
          })
        }
      })
      console.log('rights', res.data)
      setrightsList(res.data)
    })
  }, [])


  const handleOk = () => {
    setIsModalOpen(false);
    // 同步datasource
    setdataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    // patch到后端
    axios.patch(`/roles/${currentId}`, { rights: currentRights })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />

      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightsList}
        />
      </Modal>
    </div>
  )
}
