import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';

const { Option } = Select;


const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setisDisabled] = useState(false)

  useEffect(() => {
    setisDisabled(props.isEditable)
  }, [props.isEditable])

  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1': 'superadmin',
    '2': 'regionadmin',
    '3': 'editor'
  }

  const checkRegionDisabled = (item) => {
    // 若是编辑
    if (props.isEdit) {
      // 若是超级管理员，区域不禁用
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        // 否则区域禁用
        return true
      }
    } else {
      // 若是创建
      // 若是超级管理员，区域不禁用
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        // 否则区域禁用
        return item.value !== region
      }
    }
  }

  return (
    <Form
      ref={ref}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select disabled={isDisabled} placeholder="select the region">
          {props.regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select onChange={(value) => {
          console.log('33', value)
          if (value === 1) {
            setisDisabled(true)
            ref.current.setFieldsValue({
              region: ''
            })
          } else {
            setisDisabled(false)
          }
        }} placeholder="select the role">
          {props.roleList.map(item => <Option value={item.id} key={item.id}>{item.roleName}</Option>)}
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm
