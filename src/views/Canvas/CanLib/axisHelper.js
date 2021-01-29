export default class AxisHelper {
  constructor ({ sandbox, x, y, color }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.zIndex = 100
    this.color = color || '#ffffff'
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(this.x, 0)
    this.ctx.lineTo(this.x, this.sandbox.height)
    this.ctx.moveTo(0, this.y)
    this.ctx.lineTo(this.sandbox.width, this.y)
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.restore()
  }

  destruct () {
    this.sandbox.remove(this)
  }
}
