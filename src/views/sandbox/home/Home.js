import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from "axios";
// 第一步：导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

export default function Home () {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [open, setOpen] = useState(false);
  const [pieChart, setpieChart] = useState(null);
  const [allList, setallList] = useState([])


  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      console.log('viewList', res.data)
      setviewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      console.log('starList', res.data)
      setstarList(res.data)
    })
  }, [])

  useEffect(() => {
    // 获取柱状图数据
    axios.get('/news?publishState=2&_expand=category').then(res => {
      // console.log('all', res.data)
      console.log(_.groupBy(res.data, item => item.category.title))

      renderBarView(_.groupBy(res.data, item => item.category.title))

      setallList(res.data)
    })

    // 组件销毁
    window.onresize = null

  }, [])



  // 柱状图
  const renderBarView = (obj) => {
    // 第三步：初始化echarts实例
    // 基于准备好的dom，初始化echarts实例(此时页面元素已渲染完毕)
    var myChart = echarts.init(barRef.current)

    // 第四步：准备数据和配置项，指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length),
        },
      ],
    }

    // 第五步：使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)

    window.onresize = () => {
      console.log('resize')
      myChart.resize()
    }
  }


  // 饼状图
  const renderPieView = (obj) => {
    var currentList = allList.filter(item => item.author === username)
    console.log(currentList)
    // 获取数据后，转换数据格式
    var groupObj = _.groupBy(currentList, item => item.category.title)
    console.log(groupObj)
    var list = []
    for (var i in groupObj) {
      list.push({
        value: groupObj[i].length,
        name: i,
      })
    }
    console.log(list)

    var myChart;
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }

    var option = {
      title: {
        text: '当前用户新闻分类图',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }


  // 抽屉事件

  const showDrawer = () => {
    setOpen(true);
    setTimeout(() => {
      // 初始化饼状图数据
      renderPieView()
    }, 0)
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={true}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => { showDrawer() }} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b style={{ marginRight: '20px' }}>{region ? region : '全球'}</b>
                    <b>{roleName}</b>
                  </div>
                }
              />
            </Card>
          </Card>
        </Col>
      </Row>

      {/* echart视图 */}
      <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>

      {/* 抽屉效果 */}
      <Drawer width={'500px'} title="个人新闻分类" placement="right" onClose={onClose} open={open}>
        <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
      </Drawer>
    </div>
  )
}
