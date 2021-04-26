export default class Background {
  constructor ({ sandbox, x, y, width, height, image }) {
    this.sandbox = sandbox
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.image = image
    this.zIndex = -1
    this.id = this.sandbox.getEntityId()
    console.log(this.id)
    this.visible = true
  }

  render () {
    if (this.image) {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
  }
}
