import Util from './util'
const eventNames = [
  'click', 'contextmenu', 'mousedown', 'mouseup', 'mousemove', 'mouseleave'
]
function * idGenerator () {
  for (let i = 1; true; i++) {
    yield i
  }
}
const idIterator = idGenerator()
export default class Sandbox {
  constructor (elem, { width, height }) {
    this.elem = elem
    this.render = true
    this.ctx = elem.getContext('2d')
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)'
    this.width = width
    this.height = height
    this.children = [] // 主要覆盖物
    this.attachment = [] // 附加物
    // 绑定this，否则addEventListener时this会指向elem
    this.handleEvent = this.handleEvent.bind(this)
    // 每个类型的事件保存为一个Map，Map中key/value为覆盖物的id和callback的Set

    this.eventMap = {}
    eventNames.forEach(name => {
      this.eventMap[name] = new Map()
      elem.addEventListener(name, this.handleEvent)
    })
    // 每一帧都全部渲染
    this.renderAll()
  }

  destroy () {
    this.render = false
    this.children.length = 0
    this.attachment.length = 0
    eventNames.forEach(name => {
      this.elem.removeEventListener(name, this.handleEvent)
    })
  }

  getEntityId () {
    return idIterator.next().value
  }

  // 事件处理
  handleEvent (e) {
    const type = e.type
    if (type === 'contextmenu') {
      e.preventDefault()
    }
    const poi = [e.offsetX.toFixed(2) - 0, e.offsetY.toFixed(2) - 0]
    const activeChildren = Array.from(this.eventMap[type].keys()).map(id => {
      return this.children.find(c => c.id === id) || null
    }).filter(c => {
      return c && c.visible && (
        (c.judgeBy === 'points' && Util.judge(poi, c.points)) ||
          (c.judgeBy === 'circle' && Util.poiInCircle(poi, [c.x, c.y], c.radius))
      )
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
      for (const item of callbackSet.values()) {
        item.handler()
      }
    }
    if (this.eventMap[type].has('sandbox')) {
      // sandbox本身的事件单独处理
      const callbackSet = this.eventMap[type].get('sandbox')
      for (const item of callbackSet.values()) {
        if (!activeChild || item.option.permeate) {
          item.handler(poi)
        }
      }
    }
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

  addAttachment (item) {
    this.attachment.push(item)
  }

  removeAttachment (item) {
    const index = this.attachment.indexOf(item)
    if (index !== -1) this.attachment.splice(index, 1)
  }

  // 添加事件绑定
  on (type, callback, option = {}) {
    const eventMap = this.eventMap[type]
    if (eventMap) {
      if (!eventMap.has('sandbox')) {
        eventMap.set('sandbox', [])
      }
      const callbackSet = eventMap.get('sandbox')
      callbackSet.push({
        handler: callback,
        option: option
      })
    } else {
      console.error('事件类型有误')
    }
  }

  // 移除事件绑定
  off (type, callback) {
    const eventMap = this.eventMap[type]
    if (eventMap) {
      const callbackSet = eventMap.get('sandbox')
      if (callbackSet) {
        const index = callbackSet.findIndex(i => i.handler === callback)
        if (index !== -1) {
          callbackSet.splice(index, 1)
        }
      }
    } else {
      console.error('事件类型有误')
    }
  }

  // 全部渲染
  renderAll () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    const copy = [...this.children.filter(c => c.visible), ...this.attachment.filter(c => c.visible)]
    copy.sort((a, b) => a.zIndex - b.zIndex)
    copy.forEach(item => {
      item.render()
    })
    if (this.render) {
      requestAnimationFrame(this.renderAll.bind(this))
    }
  }
}
