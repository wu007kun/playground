export default class Background {
  constructor ({ sandbox, x, y, width, height, src }) {
    this.ctx = sandbox.ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.src = src
    this.zIndex = -1
  }

  setImage (url, width, height) {
    return new Promise((resolve, reject) => {
      const image = document.createElement('img')
      image.onload = () => {
        let w = width; let h = height
        if (image.width >= image.height) {
          h = width / image.width * image.height
        } else {
          w = height / image.height * image.width
        }
        this.width = w
        this.height = h
        this.src = image
        resolve()
      }
      image.onerror = reject
      image.src = url
    })
  }

  render () {
    if (this.src) {
      this.ctx.drawImage(this.src, this.x, this.y, this.width, this.height)
    }
  }
}
