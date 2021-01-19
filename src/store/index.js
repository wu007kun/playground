import { createStore } from 'vuex'
function findTreeItem (treeData, id) {
  const pathArr = id.split('-')
  const idArr = pathArr.map((n, index) => pathArr.slice(0, index + 1).join('-'))
  const item = idArr.reduce((prev, cur) => {
    if (prev) {
      return prev.children.find(i => i.id === cur)
    } else {
      return treeData.find(i => i.id === cur)
    }
  }, null)
  return item
}
function findParent (treeData, id) {
  const pathArr = id.split('-')
  pathArr.pop()
  const parentId = pathArr.join('-')
  return findTreeItem(treeData, parentId)
}
export default createStore({
  state: {
    treeData: []
  },
  mutations: {
    initTreeData (state, data) {
      state.treeData = data
    },
    addToTree (state, params) {
      const item = findTreeItem(state.treeData, params.id)
      const lastId = item.children.length ? item.children[item.children.length - 1].id.split('-').pop() - 0 : 0
      const id = item.id + '-' + (lastId + 1)

      item.children.push({
        name: '点击修改',
        id: id,
        type: params.type,
        children: []
      })
    },
    deleteFromTree (state, id) {
      const parent = findParent(state.treeData, id)
      const index = parent.children.findIndex(i => i.id === id)
      parent.children.splice(index, 1)
    },
    changeName (state, params) {
      const item = findTreeItem(state.treeData, params.id)
      item.name = params.value
    }
  },
  actions: {
  },
  modules: {
  }
})
