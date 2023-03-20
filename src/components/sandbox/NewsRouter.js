import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { Spin } from 'antd'

import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import AuditNews from '../../views/sandbox/audit-manage/AuditNews'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from "axios"
import { connect } from "react-redux"


const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/news-manage/preview/:id': NewsPreview,
  '/news-manage/update/:id': NewsUpdate,
  '/audit-manage/audit': AuditNews,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset,
}

function NewsRouter (props) {

  const [backRouteList, setbackRouteList] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      console.log(res)
      setbackRouteList([...res[0].data, ...res[1].data])
      // console.log('000', [...res[0].data, ...res[1].data])
    })
  }, [])

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {
          backRouteList.map(item => {
            if (checkRoute(item) && checkUserPermission(item)) {
              return <Route path={item.key} key={item.id} component={LocalRouterMap[item.key]} exact />
            }
            return null
          }
          )
        }

        <Redirect from="/" to='/home' exact />
        {
          backRouteList.length > 0 && <Route path='*' component={NoPermission}></Route>
        }
      </Switch>
    </Spin>
  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsRouter)