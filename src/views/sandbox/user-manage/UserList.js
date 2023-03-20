import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Popover, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";

import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList () {
  const [dataSource, setdataSource] = useState([])
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const [open, setOpen] = useState(false);
  const [isEditable, setisEditable] = useState(false)
  const [current, setcurrent] = useState(null)
  const addForm = useRef(null)
  const editForm = useRef(null)

  const { username, roleId, region } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'regionadmin',
      '3': 'editor'
    }

    axios.get('/users?_expand=role').then(res => {
      console.log('users', res.data)
      const list = res.data
      // 管理员可以有所有权限，非管理员有对应级别的权限
      setdataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    }, [roleId, region, username])

    axios.get('/regions').then(res => {
      console.log('regions', res.data)
      setregionList(res.data)
    })

    axios.get('/roles').then(res => {
      console.log('roles', res.data)
      setroleList(res.data)
    })
  }, [])


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        // return <b>{role.roleName}</b>
        return role?.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <b>{username}</b>
      },
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onClick={() => { handleChange(item) }}></Switch>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{ textAlign: 'center' }}>
            <Switch checked={item.pagepermisson} onChange={() => { switchMethod(item) }}></Switch>
          </div>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => { handleEdit(item) }}></Button>
          </Popover>
          <Button type="primary" danger shape='circle' icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} disabled={item.default}></Button>
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
        deleteusers(item)
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  };


  // 添加用户
  const addFormOk = () => {
    // console.log('add', addForm)
    addForm.current.validateFields().then(value => {
      console.log(value)
      setOpen(false)

      addForm.current.resetFields()

      // 需要先post到后端，生成了id，再设置datasource，以便以后实现删除和更新的功能
      axios.post('/users', {
        ...value,
        'roleState': true,
        'default': false
      }).then(res => {
        console.log(res.data)
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => { console.log(err) })
    setOpen(false)
  }

  // 修改用户状态
  const handleChange = (item) => {
    console.log('changestate', item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    // 状态更改后同步到后端
    axios.patch(`/users/${item.id}`, { roleState: item.roleState })
  }

  // 删除用户
  const deleteusers = (item) => {
    console.log('OK', item);
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  // 编辑用户
  const handleEdit = (item) => {
    setTimeout(() => {
      setOpen(true)
      if (item.roleId === 1) {
        // 点击编辑时，是超级管理员区域禁用
        setisEditable(true)
      } else {
        // 否则取消禁用
        setisEditable(false)
      }
      editForm.current.setFieldsValue(item)
    }, 0)
    setcurrent(item)
  }

  // 编辑用户确认
  const editFormOk = () => {
    editForm.current.validateFields().then(value => {
      console.log('editFormOk', value)
      editForm.current.resetFields()

      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.id)[0]
          }
        }
        return item
      }))
      setisEditable(!isEditable)

      axios.patch(`/users/${current.id}`, value)
    })
    setOpen(false)
  }

  return (
    <div>
      <Button type='primary' style={{ color: 'white', marginBottom: '10px' }} onClick={() => {
        setOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setOpen(false) }}
        onOk={() => { addFormOk() }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={open}
        title="编辑用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
          setisEditable(!isEditable)
        }}
        onOk={() => { editFormOk() }}
        isEdit={true}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={editForm} isEditable={isEditable}></UserForm>
      </Modal>

    </div>
  )
}
