export default class Circle {
  constructor ({ sandbox, x, y, radius, color, zIndex }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.entityType = 'circle'
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.judgeBy = 'circle'
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 3
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
      if (callbackSet) {
        if (callback) {
          if (callbackSet.has(callback)) {
            callbackSet.delete(callback)
          }
        } else {
          // remove all
          // console.log('remove all')
          // for (const cb of callbackSet) {
          //   callbackSet.delete(cb)
          // }
        }
      } else {
        console.error('事件绑定对象有误')
      }
    } else {
      console.error('事件类型有误')
    }
  }
}
