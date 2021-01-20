export default // 多边形
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
