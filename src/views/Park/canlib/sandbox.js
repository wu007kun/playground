import Util from './util'
/**
 * 概念
 * 实体 = entity = child
 */
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
  constructor (elem, { width, height, render }) {
    this.freezeClick = false
    this.elem = elem
    this.render = render
    this.ctx = elem.getContext('2d')
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)'
    this.width = width
    this.height = height
    this.children = [] // 主要覆盖物
    this.attachment = [] // 附加物
    // 绑定this，否则addEventListener时this会指向elem
    this.handleEvent = this.handleEvent.bind(this)
    // 每个类型的事件保存为一个Map，Map中key/value为覆盖物的id和callback的Set

    this.eventTypeMap = new Map()
    /**
     * 事件结构，三层Map
     * 第一层，事件类型 eventTypeMap(Map) --> {type: entityIdMap(Map)}
     * 第二层，实体id   entityIdMap --> {id: callbackMap(Map)}
     * 第三层，回调函数: 配置项 callbackMap --> {fn: option}
     */
    eventNames.forEach(name => {
      this.eventTypeMap.set(name, new Map())
      elem.addEventListener(name, this.handleEvent)
    })
    this.renderAll()
    this.autoRender()
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
    // 拖动不触发点击
    if (type === 'mousemove') {
      this.freezeClick = true
    } else if (type === 'mousedown') {
      this.freezeClick = false
    } else if (type === 'click' && this.freezeClick) {
      return
    }
    if (type === 'contextmenu') {
      e.preventDefault()
    }
    const entityIdMap = this.eventTypeMap.get(type)
    const poi = [e.offsetX.toFixed(2) - 0, e.offsetY.toFixed(2) - 0]
    const activeChildren = this.children.filter(c =>
      /**
       * 事件判定：
       * 1. 绑定了事件
       * 2. 可见
       * 3. 坐标有效
       */
      entityIdMap.has(c.id) &&
      c.visible && (
        (c.judgeBy === 'points' && Util.judge(poi, c.points)) ||
        (c.judgeBy === 'circle' && Util.poiInCircle(poi, [c.x, c.y], c.radius))
      )
    )

    // 获取被点击实体中zIndex最大的，zIndex相同时取后一个
    const topChild = activeChildren.reduce((prev, cur) => {
      if (prev) {
        return prev.zIndex > cur.zIndex ? prev : cur
      } else {
        return cur
      }
    }, null)

    // 触发其事件
    if (topChild) {
      const callbackMap = entityIdMap.get(topChild.id)
      if (callbackMap) {
        for (const cb of callbackMap.keys()) {
          cb()
        }
      }
    }
    // 对于其他被触及的实体，如果设置了渗透permeate，则也会触发事件，但这里没有处理顺序和zIndex
    activeChildren.forEach(c => {
      if (c !== topChild) {
        const callbackMap = entityIdMap.get(c.id)
        if (callbackMap) {
          for (const cb of callbackMap.keys()) {
            const option = callbackMap.get(cb)
            if (option && option.permeate) {
              cb()
            }
          }
        }
      }
    })
    // 处理sandbox的点击
    const callbackMapOfSandbox = entityIdMap.get('sandbox')
    if (callbackMapOfSandbox) {
      for (const cb of callbackMapOfSandbox.keys()) {
        const option = callbackMapOfSandbox.get(cb)
        if (!topChild || (option && option.permeate)) {
          cb(poi)
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
    const entityIdMap = this.eventTypeMap.get(type)
    if (entityIdMap) {
      if (!entityIdMap.has('sandbox')) {
        entityIdMap.set('sandbox', new Map())
      }
      const callbackMap = entityIdMap.get('sandbox')
      callbackMap.set(callback, option)
    } else {
      console.error('事件类型有误')
    }
  }

  // 移除事件绑定
  off (type, callback) {
    const entityIdMap = this.eventTypeMap.get(type)
    if (entityIdMap) {
      const callbackMap = entityIdMap.get('sandbox')
      if (callbackMap && callbackMap.has(callback)) {
        callbackMap.delete(callback)
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
  }

  autoRender () {
    if (this.render) {
      this.renderAll()
    }
    requestAnimationFrame(this.autoRender.bind(this))
  }
}
