import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import { Steps, Button, Form, Input, Select, message, notification } from 'antd';

import style from './News.module.css'
import axios from "axios";

import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Option } = Select;





export default function NewsAdd (props) {
  const [current, setcurrent] = useState(0)
  const [categoryList, setcategoryList] = useState([])

  const [formInfo, setformInfo] = useState({})
  const [content, setcontent] = useState('')

  const User = JSON.parse(localStorage.getItem('token'))

  const newsFormRef = React.useRef(null);

  useEffect(() => {
    axios.get('/categories').then(res => {
      console.log('categories', res.data)
      const list = res.data
      setcategoryList(list)
    })
  }, [])

  // 处理下一步
  const handleNext = () => {
    // 表单校验通过，跳下一步
    if (current === 0) {
      newsFormRef.current.validateFields().then(res => {
        console.log('validate', res)
        // 存储表单信息
        setformInfo(res)
        setcurrent(current + 1)
      }).catch(error => { console.log(error) })
    } else {
      // 若富文本未输入内容或输入后删除，给提示
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        // 此时formInfo和content都能收集到
        console.log('all', formInfo, content)
        setcurrent(current + 1)
      }
    }
  }

  // 处理上一步
  const handlePrevious = () => {
    setcurrent(current - 1)
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();


  const onFinish = (values) => {
    console.log(values);
  }

  // 保存草稿/提交审核
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region ? User.region : '全球',
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: '通知',
        description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表中'}中查看您的新闻`,
        placement: 'bottom'
      })
    })
  }


  return (
    <div>
      <PageHeader
        className='site-page-header'
        title='撰写新闻'
      />

      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主体内容',
            subTitle: '',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />

      <div style={{ marginTop: '30px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            {...layout}
            ref={newsFormRef}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="title" label="新闻标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true }]}>
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              >
                {categoryList.map(item =>
                  <Option value={item.id} key={item.id}>{item.title}</Option>
                )}
              </Select>
            </Form.Item>
          </Form>

        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            console.log('props', value)
            // 收到子组件传来的文本内容，存储起来
            setcontent(value)
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current < 2 && <Button type="primary" onClick={() => { handleNext() }}>next</Button>
        }
        {
          current > 0 && <Button onClick={() => { handlePrevious() }}>previous</Button>
        }
        {current === 2 && <span>
          <Button type="primary" onClick={() => { handleSave(0) }}>保存草稿</Button>
          <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
        </span>}
      </div>
    </div>
  )
}

