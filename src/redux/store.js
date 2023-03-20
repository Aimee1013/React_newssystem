import { legacy_createStore as createStore, combineReducers } from 'redux'
import { CollapseReducer } from "./reducers/CollapseReducer"
import { LoadingReducer } from "./reducers/LoadingReducer"

// 合并多个reducer
const reducer = combineReducers({
  CollapseReducer,
  LoadingReducer
})

const store = createStore(reducer)

export default store