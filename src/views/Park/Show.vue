<template>
  <div class="park-status" ref="page">
    <div class="wrap"
      ref="wrap"
      :style="{width: wrapWidth + 'px', height: wrapHeight + 'px'}">
      <canvas ref="canvas"
        :style="{
          transform: `scale(${scale}) translate(${transX}px, ${transY}px)`
        }"></canvas>
    </div>
    <div class="data-panel">
      <p class="title">北停车场</p>
      <div class="current">
        实时剩余车位
        <p class="park-data"><span class="highlight">{{ totalCount - currentCount }}</span> / {{ totalCount }}</p>
      </div>
      <div>
        <div class="reset-btn" @click="updateStatus">更新状态</div>
        <div class="reset-btn" @click="resetPosition">初始位置</div>
      </div>

    </div>
  </div>
</template>
<script>
import { getList } from './api'
import CanLib from '../../canlib/index'
import carImg1 from './assets/car1.png'
import carImg2 from './assets/car2.png'
import carImg3 from './assets/car3.png'
import carImg4 from './assets/car4.png'
import carImg5 from './assets/car5.png'
import carImg6 from './assets/car6.png'
import carImg7 from './assets/car7.png'
import carImg8 from './assets/car8.png'
import carImg9 from './assets/car9.png'
import carImg10 from './assets/car10.png'
import carImg11 from './assets/car11.png'
import busImg1 from './assets/bus1.png'
import busImg2 from './assets/bus2.png'
let wrapElem = null
let cElem = null
let sandbox = null // 画布
const carMap = new Map()
const carTypes = [
  {
    type: 1,
    src: [carImg1, carImg2, carImg3, carImg4, carImg5, carImg6, carImg7, carImg8, carImg9, carImg10, carImg11],
    img: []
  },
  {
    type: 2,
    src: [busImg1, busImg2],
    img: []
  }
]
function getRandomItem (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
export default {
  data () {
    return {
      transX: 0,
      transY: 0,
      beginMouseX: 0,
      beginMouseY: 0,
      beginTransX: 0,
      beginTransY: 0,
      scale: 1,
      initialScale: 1,
      initialWidth: 0,
      initialHeight: 0,
      pageWidth: 0,
      pageHeight: 0,
      wrapWidth: 0,
      wrapHeight: 0,
      totalCount: 0,
      currentCount: 0
    }
  },
  async mounted () {
    const pageDom = this.$refs.page
    this.pageWidth = pageDom.clientWidth
    this.pageHeight = pageDom.clientHeight
    this.initCanvas()
    const img = require('./assets/park.jpg')
    this.initBgImage(img)
    await this.loadImages()
    await this.setExistCar()
    this.updateStatus()
  },
  beforeUnmount () {
    this.destroyCanvas()
  },
  methods: {
    loadImages () {
      return Promise.all(carTypes.map(info => {
        return Promise.all(info.src.map(src => {
          return new Promise((resolve, reject) => {
            const image = document.createElement('img')
            image.onload = () => {
              info.img.push(image)
              resolve()
            }
            image.onerror = reject
            image.src = src
          })
        }))
      }))
    },
    // 初始化
    initCanvas () {
      wrapElem = this.$refs.wrap
      cElem = this.$refs.canvas
      sandbox = new CanLib.Sandbox(cElem, {
        width: this.pageWidth,
        height: this.pageHeight,
        render: false
      })
      // 拖动和缩放，在canvas之外也应触发，因此绑定在父级DOM元素上
      wrapElem.addEventListener('mousedown', this.judgeDrag)
      wrapElem.addEventListener('mousewheel', this.handleMouseWheel)
    },
    setExistCar () {
      return getList({
        park: 1 // 北停车场
      }).then(data => {
        this.totalCount = data.length
        data.forEach(params => {
          const marker = this.drawCar(params)
          marker.visible = false
          carMap.set(params.deviceID, marker)
        })
      })
    },
    drawCar (info) {
      const arr = info.type === 1 ? carTypes[0].img : carTypes[1].img
      const image = getRandomItem(arr)
      const marker = new CanLib.Marker({
        sandbox,
        ...info,
        image: image
      })
      sandbox.add(marker)
      return marker
    },
    updateStatus () {
      let n = 0
      for (const marker of carMap.values()) {
        const visible = Math.round(Math.random())
        if (visible) {
          n++
        }
        marker.visible = Boolean(visible)
      }
      this.currentCount = n
      this.updateRender()
    },
    // 销毁整个canvas
    destroyCanvas () {
      sandbox.destroy()
      wrapElem.removeEventListener('mousedown', this.judgeDrag)
      wrapElem.removeEventListener('mousewheel', this.handleMouseWheel)
      document.removeEventListener('keyup', this.handleKey)
    },
    // 拖动画布
    judgeDrag (e) {
      this.beginMouseX = e.clientX
      this.beginMouseY = e.clientY
      this.beginTransX = this.transX
      this.beginTransY = this.transY
      wrapElem.addEventListener('mousemove', this.moveCanvas)
      wrapElem.addEventListener('mouseup', this.stopMoveCanvas)
      wrapElem.addEventListener('mouseleave', this.stopMoveCanvas)
    },
    moveCanvas (e) {
      if (this.activeCircle) return
      const diffX = (e.clientX - this.beginMouseX) / this.scale
      const diffY = (e.clientY - this.beginMouseY) / this.scale
      this.transX = this.beginTransX + diffX
      this.transY = this.beginTransY + diffY
    },
    stopMoveCanvas () {
      wrapElem.removeEventListener('mousemove', this.moveCanvas)
      wrapElem.removeEventListener('mouseup', this.stopMoveCanvas)
      wrapElem.removeEventListener('mouseleave', this.stopMoveCanvas)
    },
    // 缩放
    handleMouseWheel (e) {
      e.preventDefault()
      const factor = 0.2
      const max = 12
      const delta = e.wheelDelta
      if (delta > 0) {
        const scale = this.scale + factor
        if (scale < this.initialScale * max) {
          this.scale = scale
        } else {
          this.scale = this.initialScale * max
        }
      } else if (delta < 0 && this.scale > this.initialScale) {
        const scale = this.scale - factor
        if (scale > this.initialScale) {
          this.scale = scale
        } else {
          this.scale = this.initialScale
        }
      }
    },
    // 画背景图
    initBgImage (src) {
      const image = document.createElement('img')
      image.onload = () => {
        this.afterLoadImg(image)
        this.$refs.canvas.style.backgroundImage = `url(${src})`
      }
      image.src = src
    },
    afterLoadImg (image) {
      const width = image.width
      const height = image.height
      this.initialWidth = width
      this.initialHeight = height
      sandbox.width = width
      cElem.width = width
      sandbox.height = height
      cElem.height = height
      if (this.pageWidth / this.pageHeight > width / height) {
        this.wrapWidth = width / height * this.pageHeight
        this.wrapHeight = this.pageHeight
      } else {
        this.wrapWidth = this.pageWidth
        this.wrapHeight = height / width * this.wrapWidth
      }
      this.scale = this.wrapWidth / width
      this.initialScale = this.scale
    },
    resetPosition () {
      this.transX = 0
      this.transY = 0
      this.scale = this.initialScale
    },
    updateRender () {
      sandbox.renderAll()
    }
  }
}
</script>
<style lang="less">
.park-status {
  width: 100%; height: 100%;
  user-select: none;
  background-color: #333;
  --bg: rgba(0, 0, 0, .8);
  .wrap {
    margin: 0 auto;
    position: relative;
    display: block;
    --size: 20px;
    --color: #555;
    background-image: linear-gradient(45deg, var(--color) 25%, transparent 25%, transparent 75%, var(--color) 75%, var(--color)),
      linear-gradient(45deg, var(--color) 25%, transparent 25%, transparent 75%, var(--color) 75%, var(--color));
    background-size: var(--size) var(--size);
    background-position: 0 0, calc(var(--size) / 2) calc(var(--size) / 2);
    overflow: hidden;
    display: flex; justify-content: center; align-items: center;
    canvas {
      display: block;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .data-panel {
    position: absolute; top: 0; right: 0;
    width: 300px;
    background: var(--bg);
    color: #fff;
    .title {
      margin: 10px 0;
    }
    .current {
      display: flex; justify-content: center;
      .park-data {
        margin: 0 20px;
        color: gold;
        .highlight {
          font-size: 22px;
        }
      }
    }
    .reset-btn {
      display: inline-block;
      margin: 20px 10px;
      padding: 3px 10px;
      background-color: #409eff;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
