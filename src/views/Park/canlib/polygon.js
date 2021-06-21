import Overlay from './overlay'

export default // 多边形
class Polygon extends Overlay {
  constructor ({ sandbox, points, color, zIndex }) {
    super()
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.entityType = 'polygon'
    this.points = [...points]
    this.color = color || '#fff'
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.visible = true
    this.judgeBy = 'points'
    this.custom = {}
  }

  render () {
    if (!this.points.length) return
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(...(this.points[0]))
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
}
