import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import { Descriptions } from 'antd';
import axios from "axios";
import moment from 'moment'

export default function NewsPreview (props) {

  const [previewContent, setpreviewContent] = useState(null)

  useEffect(() => {
    // console.log('preview', props.match.params.id)
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data)
      setpreviewContent(res.data)
    })
  }, [props.match.params.id])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const pubishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black', 'orange', 'green', 'red']

  return (
    <div>
      {previewContent && <div>
        <PageHeader
          className='site-page-header'
          title={previewContent.title}
          subTitle={previewContent.category.title}>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">{previewContent.author}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{moment(previewContent.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{previewContent.publishTime ? moment(previewContent.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
            <Descriptions.Item label="区域">{previewContent.region}</Descriptions.Item>
            <Descriptions.Item label="审核状态" contentStyle={{ color: colorList[previewContent.auditState] }}>{auditList[previewContent.auditState]}</Descriptions.Item>
            <Descriptions.Item label="发布状态" contentStyle={{ color: colorList[previewContent.auditState] }}>{pubishList[previewContent.publishState]}</Descriptions.Item>
            <Descriptions.Item label="访问数量">{previewContent.view}</Descriptions.Item>
            <Descriptions.Item label="点赞数量">{previewContent.star}</Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>

          <div dangerouslySetInnerHTML={{ __html: previewContent.content }} style={{ border: '1px solid #ccc' }}></div>
        </PageHeader></div>}
    </div>
  )
}
