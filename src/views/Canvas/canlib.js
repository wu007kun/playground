class Sandbox {
  constructor (elem, { width, height }) {
    this.ctx = elem.getContext('2d')
    this.width = width
    this.height = height
    // 覆盖物
    this.children = []
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
    requestAnimationFrame(this.renderAll.bind(this))
  }
}

// 多边形
class Polygon {
  constructor ({ sandbox, points, color, zIndex }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.points = [...points]
    this.color = color || '#fff'
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  render () {
    if (!this.points.length) return
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(...this.points[0])
    for (let i = 1; i < this.points.length; i++) {
      const arr = this.points[i]
      if (arr.length === 2) {
        this.ctx.lineTo(...arr)
      }
    }
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
  }

  destruct () {
    this.sandbox.remove(this)
  }

  on (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      if (!eventMap.has(this.id)) {
        eventMap.set(this.id, new Set())
      }
      const callbackSet = eventMap.get(this.id)
      callbackSet.add(callback)
    } else {
      console.error('事件类型有误')
    }
  }

  off (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      const callbackSet = eventMap.get(this.id)
      if (callbackSet && callbackSet.has(callback)) {
        callbackSet.delete(callback)
      }
    } else {
      console.error('事件类型有误')
    }
  }
}

class Rect {
  constructor ({ sandbox, xmin, ymin, xmax, ymax, color, zIndex }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.points = [[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax]]
    this.xmin = xmin
    this.xmax = xmax
    this.ymin = ymin
    this.ymax = ymax
    this.color = color
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin)
    this.ctx.restore()
  }

  destruct () {
    this.sandbox.remove(this)
  }

  on (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      if (!eventMap.has(this.id)) {
        eventMap.set(this.id, new Set())
      }
      const callbackSet = eventMap.get(this.id)
      callbackSet.add(callback)
    } else {
      console.error('事件类型有误')
    }
  }

  off (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      const callbackSet = eventMap.get(this.id)
      if (callbackSet && callbackSet.has(callback)) {
        callbackSet.delete(callback)
      }
    } else {
      console.error('事件类型有误')
    }
  }
}

class CtrlCircle {
  constructor ({ sandbox, x, y, radius, color, zIndex }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = '#ffffff'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  destruct () {
    this.sandbox.remove(this)
  }

  on (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      if (!eventMap.has(this.id)) {
        eventMap.set(this.id, new Set())
      }
      const callbackSet = eventMap.get(this.id)
      callbackSet.add(callback)
    } else {
      console.error('事件类型有误')
    }
  }

  off (type, callback) {
    const eventMap = this.sandbox.eventMap[type]
    if (eventMap) {
      const callbackSet = eventMap.get(this.id)
      if (callbackSet && callbackSet.has(callback)) {
        callbackSet.delete(callback)
      }
    } else {
      console.error('事件类型有误')
    }
  }
}

// 背景图片
class BgImage {
  constructor ({ sandbox, x, y, width, height, src }) {
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.src = src
    this.zIndex = -1
  }

  setImage (url, width, height) {
    return new Promise((resolve, reject) => {
      const image = document.createElement('img')
      image.onload = () => {
        let w = width; let h = height
        if (image.width >= image.height) {
          h = width / image.width * image.height
        } else {
          w = height / image.height * image.width
        }
        this.width = w
        this.height = h
        this.src = image
        resolve()
      }
      image.onerror = reject
      image.src = url
    })
  }

  render () {
    if (this.src) {
      this.ctx.drawImage(this.src, this.x, this.y, this.width, this.height)
    }
  }
}

class Arrow {
  constructor ({ ctx, fromX, fromY, toX, toY, theta, headlen, width, color }) {
    this.ctx = ctx
    this.fromX = fromX || 0
    this.fromY = fromY || 0
    this.toX = toX || 10
    this.toY = toY || 10
    this.theta = theta || 30
    this.headlen = headlen || 10
    this.width = width || 2
    this.color = color || '#000'
    this.zIndex = 0
  }

  render () {
    const angle = Math.atan2(this.fromY - this.toY, this.fromX - this.toX) * 180 / Math.PI
    const angle1 = (angle + this.theta) * Math.PI / 180
    const angle2 = (angle - this.theta) * Math.PI / 180
    const topX = this.headlen * Math.cos(angle1)
    const topY = this.headlen * Math.sin(angle1)
    const botX = this.headlen * Math.cos(angle2)
    const botY = this.headlen * Math.sin(angle2)
    this.ctx.save()
    this.ctx.beginPath()
    let arrowX = this.fromX - topX
    let arrowY = this.fromY - topY
    this.ctx.moveTo(arrowX, arrowY)
    this.ctx.moveTo(this.fromX, this.fromY)
    this.ctx.lineTo(this.toX, this.toY)
    arrowX = this.toX + topX
    arrowY = this.toY + topY
    this.ctx.moveTo(arrowX, arrowY)
    this.ctx.lineTo(this.toX, this.toY)
    arrowX = this.toX + botX
    arrowY = this.toY + botY
    this.ctx.lineTo(arrowX, arrowY)
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.width
    this.ctx.stroke()
    this.ctx.restore()
  }
}

class Util {
  static judge (poi, coordinates, noneZeroMode) {
    /**
    * @param  poi [x, y] 需要判断的点
    * @param  coordinates [[x1,y1],[x2, y2]] 多边形点坐标的数组
    *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。
    * @param
    */
    // 为保证图形能够闭合，起点和终点必须相等。
    coordinates.push(coordinates[0])
    // 默认启动none zero mode
    noneZeroMode = noneZeroMode || 1
    const x = poi[0]
    const y = poi[1]
    let crossNum = 0
    // 点在线段的左侧数目
    let leftCount = 0
    // 点在线段的右侧数目
    let rightCount = 0
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i]
      const end = coordinates[i + 1]
      // 起点、终点斜率不存在的情况
      if (start[0] === end[0]) {
        // 因为射线向右水平，此处说明不相交
        if (x > start[0]) continue
        // 从左侧贯穿
        if ((end[1] > start[1] && y >= start[1] && y <= end[1])) {
          leftCount++
          crossNum++
        }
        // 从右侧贯穿
        if ((end[1] < start[1] && y >= end[1] && y <= start[1])) {
          rightCount++
          crossNum++
        }
        continue
      }
      // 斜率存在的情况，计算斜率
      const k = (end[1] - start[1]) / (end[0] - start[0])
      // 交点的x坐标
      const x0 = (y - start[1]) / k + start[0]
      // 因为射线向右水平，此处说明不相交
      if (x > x0) continue
      if ((end[0] > start[0] && x0 >= start[0] && x0 <= end[0])) {
        crossNum++
        if (k >= 0) leftCount++
        else rightCount++
      }
      if ((end[0] < start[0] && x0 >= end[0] && x0 <= start[0])) {
        crossNum++
        if (k >= 0) rightCount++
        else leftCount++
      }
    }
    return noneZeroMode === 1 ? leftCount - rightCount !== 0 : crossNum % 2 === 1
  }
}
export default {
  Sandbox,
  BgImage,
  Rect,
  CtrlCircle,
  Arrow,
  Polygon,
  Util
}
