import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import './App.css'
import IndexRouter from "./router/IndexRouter"


export default function App () {

  return (
    <Provider store={store}>
      <IndexRouter></IndexRouter>
    </Provider>
  )
}
