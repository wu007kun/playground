import CtrlCircle from './ctrlCircle'
import Util from './util'
export default class Sandbox {
  constructor (elem, { width, height }) {
    this.ctx = elem.getContext('2d')
    this.width = width
    this.height = height
    this.children = [] // 主要覆盖物
    this.attachment = [] // 附属物
    // 覆盖物的自增id
    this.entityId = 0
    // 每个类型的事件保存为一个Map，Map中key/value为覆盖物的id和callback的Set
    this.eventMap = {
      click: new Map(),
      contextmenu: new Map()
    }
    // canvas元素响应鼠标左右键点击，并将坐标传给handleEvent
    elem.addEventListener('click', e => {
      const poi = [e.offsetX.toFixed(2) - 0, e.offsetY.toFixed(2) - 0]
      this.handleEvent('click', poi)
    })
    elem.addEventListener('contextmenu', e => {
      e.preventDefault()
      const poi = [e.offsetX.toFixed(2) - 0, e.offsetY.toFixed(2) - 0]
      this.handleEvent('contextmenu', poi)
    })
    // 每一帧都全部渲染
    this.renderAll()
  }

  // 事件处理
  handleEvent (type, poi) {
    const activeChildren = Array.from(this.eventMap[type].keys()).map(id => {
      return this.children.find(c => c.id === id) || null
    }).filter(c => {
      return c && Util.judge(poi, c.points)
    })
    const activeChild = activeChildren.reduce((prev, cur) => {
      if (prev) {
        return prev.zIndex > cur.zIndex ? prev : cur
      } else {
        return cur
      }
    }, null)
    if (activeChild) {
      const callbackSet = this.eventMap[type].get(activeChild.id)
      for (const callback of callbackSet.values()) {
        callback(poi)
      }
    } else if (this.eventMap[type].has('sandbox')) {
      // sandbox本身的事件单独处理
      const callbackSet = this.eventMap[type].get('sandbox')
      for (const callback of callbackSet.values()) {
        callback(poi)
      }
    }
  }

  // 生成自增id
  getEntityId () {
    this.entityId += 1
    return this.entityId
  }

  // 添加覆盖物
  add (item) {
    this.children.push(item)
  }

  // 移除覆盖物，或者覆盖物自己调用destruct
  remove (item) {
    const index = this.children.indexOf(item)
    if (index !== -1) this.children.splice(index, 1)
  }

  // 添加事件绑定
  on (type, callback) {
    const eventMap = this.eventMap[type]
    if (eventMap) {
      if (!eventMap.has('sandbox')) {
        eventMap.set('sandbox', new Set())
      }
      const callbackSet = eventMap.get('sandbox')
      callbackSet.add(callback)
    } else {
      console.error('事件类型有误')
    }
  }

  // 移除事件绑定
  off (type, callback) {
    const eventMap = this.eventMap[type]
    if (eventMap) {
      const callbackSet = eventMap.get('sandbox')
      if (callbackSet && callbackSet.has(callback)) {
        callbackSet.delete(callback)
      }
    } else {
      console.error('事件类型有误')
    }
  }

  // 全部渲染，这里copy一下是为了不影响children的前后顺序
  renderAll () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    const copy = [...this.children.filter(c => c.visible)]
    copy.sort((a, b) => a.zIndex - b.zIndex)
    copy.forEach(item => {
      item.render()
    })
    if (this.activeEntity) {
      const vertexArr = this.activeEntity.points
      vertexArr.forEach(pos => {
        const circle = new CtrlCircle({
          sandbox: this,
          x: pos[0],
          y: pos[1],
          radius: 6,
          color: '#409eff',
          vertex: pos
        })
        circle.render()
      })
    } else {
      // console.log(this.activeEntity)
    }
    requestAnimationFrame(this.renderAll.bind(this))
  }

  setActive (entity) {
    this.activeEntity = entity
  }

  clearActive () {
    this.activeEntity = null
  }
}