import Overlay from './overlay'
import { rotatePoint } from './util'
export default class Marker extends Overlay {
  constructor ({ sandbox, x, y, width, height, image, rotate = 0, zIndex = 1 }) {
    super()
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.image = image
    this.rotate = rotate
    this.zIndex = zIndex
    this.judgeBy = 'points'
    this.id = this.sandbox.getEntityId()
    this.visible = true
  }

  get points () {
    const rectPoints = [
      [this.x - this.width / 2, this.y - this.height / 2],
      [this.x - 0 + this.width / 2, this.y - this.height / 2],
      [this.x - 0 + this.width / 2, this.y - 0 + this.height / 2],
      [this.x - this.width / 2, this.y - 0 + this.height / 2]
    ]
    const result = rectPoints.map(start => rotatePoint([this.x - 0, this.y - 0], start, this.rotate - 0))
    return result
  }

  render () {
    if (this.image) {
      this.ctx.save()
      this.ctx.translate(this.x, this.y)
      this.ctx.rotate(this.rotate * Math.PI / 180)
      this.ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height)
      this.ctx.restore()
    }
  }
}
