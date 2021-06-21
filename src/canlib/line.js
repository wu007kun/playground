import Overlay from './overlay'
export default class Line extends Overlay {
  constructor ({ sandbox, start, end, width, color, zIndex = 1 }) {
    super()
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.start = start
    this.end = end
    this.width = width
    this.color = color
    this.zIndex = zIndex
    // this.judgeBy = 'points' 线段暂不实现交互
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  render () {
    this.ctx.save()
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.width
    this.ctx.moveTo(this.start[0], this.start[1])
    this.ctx.lineTo(this.end[0], this.end[1])
    this.ctx.stroke()
    this.ctx.restore()
  }
}
