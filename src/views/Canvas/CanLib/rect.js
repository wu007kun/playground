export default class Rect {
  constructor ({ sandbox, xmin, ymin, xmax, ymax, color, zIndex }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.points = [
      [xmin, ymin],
      [xmax, ymin],
      [xmax, ymax],
      [xmin, ymax]
    ]
    this.color = color
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.points[0][0], this.points[0][1],
      this.points[2][0] - this.points[0][0],
      this.points[2][1] - this.points[0][1])
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

  set xmin (val) {
    this.points[0][0] = val
    this.points[3][0] = val
  }

  get xmin () {
    return this.points[0][0]
  }

  set ymin (val) {
    this.points[0][1] = val
    this.points[1][1] = val
  }

  get ymin () {
    return this.points[0][1]
  }

  set xmax (val) {
    this.points[1][0] = val
    this.points[2][0] = val
  }

  get xmax () {
    return this.points[1][0]
  }

  set ymax (val) {
    this.points[2][1] = val
    this.points[3][1] = val
  }

  get ymax () {
    return this.points[2][1]
  }
}