import Overlay from './overlay'

export default class Circle extends Overlay {
  constructor ({ sandbox, x, y, radius, color, fillColor = 'transparent', zIndex }) {
    super()
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.entityType = 'circle'
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.fillColor = fillColor
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    this.judgeBy = 'circle'
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 3
    this.ctx.fillStyle = this.fillColor
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }
}
