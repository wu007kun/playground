
export default class Arrow {
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
