<template>
  <div class="canvas-page">
    <canvas id="canvas-elem" width="500" height="500"></canvas>
    <div class="ctrls">
      <button @click="addPolygon">新增polygon</button>
      <button @click="addRect">新增rect</button>
      <button @click="addCtrlCircle">新增ctrlCircle</button>
    </div>
  </div>
</template>
<script>
import canlib from './canlib'
let sandbox = null
let bgImage = null
const entities = []
export default {
  data () {
    return {
      size: 500,
      newPoints: [],
      newEntity: null
    }
  },
  mounted () {
    this.initCanvas()
    // const img = require('./bg.jpg')
    // this.initBgImage(img)
    // this.drawRect()
    // this.drawPolygon({
    //   points: [[50, 50], [200, 50], [250, 100], [200, 150], [250, 200], [200, 300], [50, 250]],
    //   color: 'rgba(10, 200, 90, .2)'
    // })
    // this.drawPolygon({
    //   points: [[0, 50], [100, 50], [100, 100], [0, 100]],
    //   color: 'rgba(10, 100, 200, .2)'
    // })
  },
  methods: {
    initCanvas () {
      const c = document.getElementById('canvas-elem')
      sandbox = new canlib.Sandbox(c, { width: this.size, height: this.size })
      this.twinkle()
    },
    initBgImage (src) {
      return new Promise((resolve, reject) => {
        const image = document.createElement('img')
        image.onload = () => {
          let w = this.size
          let h = this.size
          if (image.width >= image.height) {
            h = this.size / image.width * image.height
          } else {
            w = this.size / image.height * image.width
          }
          bgImage = new canlib.BgImage({ sandbox, x: 0, y: 0, width: w, height: h, src: image })
          sandbox.add(bgImage)
          resolve()
        }
        image.onerror = reject
        image.src = src
      })
    },
    twinkle () {
      let n = 0
      setInterval(() => {
        n++
        entities.forEach((et, index) => {
          et.visible = Boolean((index + n) % 2)
        })
      }, 3000)
    },
    drawPolygon (params) {
      const polygon = new canlib.Polygon({
        sandbox,
        points: params.points,
        color: params.color
      })
      sandbox.add(polygon)
      entities.push(polygon)
      return polygon
    },
    addPolygon () {
      this.newPoints = []
      this.newEntity = null
      sandbox.on('click', this.pickPolygon)
      sandbox.on('contextmenu', this.backstep)
      document.addEventListener('keyup', this.judgePolygonEnd)
    },
    judgePolygonEnd (e) {
      console.log(e)
      if (e.key === 'Enter') {
        sandbox.off('click', this.pickPolygon)
        sandbox.off('contextmenu', this.backstep)
        this.newPoints = []
        this.newEntity = null
        console.log('结束')
        document.removeEventListener('keyup', this.judgePolygonEnd)
      }
    },
    pickPolygon (e) {
      this.newPoints.push(e)
      if (this.newPoints.length === 3) {
        this.newEntity = this.drawPolygon({
          color: 'rgba(200, 100, 110, .3)',
          points: this.newPoints
        })
      } else if (this.newPoints.length > 3 && this.newEntity) {
        this.newEntity.points = this.newPoints
      }
    },
    backstep () {
      if (this.newPoints.length) {
        this.newPoints.pop()
        if (this.newEntity) {
          if (this.newPoints.length > 2) {
            this.newEntity.points = this.newPoints
          } else {
            this.newEntity.destruct()
            this.newEntity = null
          }
        }
      }
    },
    drawRect (params) {
      const rect = new canlib.Rect({
        sandbox,
        xmin: params.xmin,
        ymin: params.ymin,
        xmax: params.xmax,
        ymax: params.ymax,
        color: params.color
      })
      sandbox.add(rect)
      entities.push(rect)
      rect.on('click', () => {
        console.log('点击了矩形')
      })
      rect.on('contextmenu', () => {
        console.log('右键了矩形')
      })
      return rect
    },
    addRect () {
      this.newPoints = []
      this.newEntity = null
      sandbox.on('click', this.pickRect)
      sandbox.on('contextmenu', this.backstepRect)
    },
    pickRect (e) {
      this.newPoints.push(e)
      if (this.newPoints.length === 2) {
        const x1 = this.newPoints[0][0]
        const y1 = this.newPoints[0][1]
        const x2 = this.newPoints[1][0]
        const y2 = this.newPoints[1][1]
        if (x1 === x2 || y1 === y2) {
          this.newPoints.pop()
          return
        }
        const xmin = x1 < x2 ? x1 : x2
        const xmax = x1 < x2 ? x2 : x1
        const ymin = y1 < y2 ? y1 : y2
        const ymax = y1 < y2 ? y2 : y1
        this.newEntity = this.drawRect({
          color: 'rgba(200, 100, 110, .3)',
          xmin,
          xmax,
          ymin,
          ymax
        })
        this.newPoints = []
        this.newEntity = null
        sandbox.off('click', this.pickRect)
        sandbox.off('contextmenu', this.backstepRect)
      }
    },
    backstepRect () {
      if (this.newPoints.length) {
        this.newPoints.pop()
        this.newEntity.destruct()
        this.newEntity = null
      }
    },
    addCtrlCircle () {
      this.newPoints = []
      this.newEntity = null
      sandbox.on('click', this.drawCtrlCircle)
    },
    drawCtrlCircle (e) {
      const cc = new canlib.CtrlCircle({
        sandbox,
        x: e[0],
        y: e[1],
        radius: 10,
        color: '#409eff'
      })
      sandbox.add(cc)
      entities.push(cc)
    }
  }
}
</script>
<style lang="less">
.canvas-page {
  #canvas-elem {
    margin: 0 auto;
    display: block;
    width: 500px; height: 500px;
    border: 1px solid #aaa;
  }

}
</style>
