export const CollapseReducer = (preState = {
  isCollapsed: false
}, action) => {
  // console.log(action)
  let { type } = action
  switch (type) {
    case 'change_collaspe':
      let newstate = { ...preState }
      newstate.isCollapsed = !newstate.isCollapsed
      return newstate
    default:
      return preState
  }
}