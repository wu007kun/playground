import Overlay from './overlay'

export default class Rect extends Overlay {
  constructor ({ sandbox, xmin, ymin, xmax, ymax, color, zIndex }) {
    super()
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.entityType = 'rect'
    this.points = [
      [xmin, ymin],
      [xmax, ymin],
      [xmax, ymax],
      [xmin, ymax]
    ]
    this.color = color
    this.zIndex = zIndex || 0
    this.id = this.sandbox.getEntityId()
    console.log(this.id)
    this.visible = true
    this.judgeBy = 'points'
    this.custom = {}
  }

  render () {
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.points[0][0], this.points[0][1],
      this.points[2][0] - this.points[0][0],
      this.points[2][1] - this.points[0][1])
    this.ctx.restore()
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
