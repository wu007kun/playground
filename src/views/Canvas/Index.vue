<template>
  <div class="label-page">
    <section class="ctrl-section">
      <div class="ctrls">
        <div class="btn" @click="emitUpload">
          替换图片
          <input style="display: none" type="file" ref="upload" @change="setImage">
        </div>
        <div class="btn" @click="addPolygon">画多边形</div>
        <div class="btn" @click="addRect">画矩形</div>
      </div>
    </section>
    <section class="canvas-section">
      <div class="wrap" ref="wrap" :style="{height: wrapHeight + 'px'}">
        <canvas id="canvas-elem"
          :style="{
            width: width + 'px',
            height: height + 'px',
            transform: `scale(${scale}) translate(${transX}px, ${transY}px)`,
            cursor: canvasCursor
          }"></canvas>
      </div>
      <div class="tip-wrap">
        <p class="tip">{{ tip }}</p>
        <p>当前坐标 {{ curX }}，{{ curY }}</p>
        <p>当前缩放 {{ parseInt(scale * 100) }}%</p>
        <p>原始尺寸 {{ initialWidth }} × {{ initialHeight }}</p>
      </div>

    </section>
    <section class="data-section">
      <div class="data-item"
        v-for="(item, index) in entities"
        :key="index"
        :class="{
          'active': this.activeEntity === item
        }">
        <div class="checkbox" :class="{
          'is-checked': item.visible
        }"
        @click="setVisible(item)"></div>
        <div>
          <input type="text" v-model="item.custom.name" placeholder="请输入名称">
          <p>类型：{{ nameDic[item.entityType] }}</p>
          <p>顶点：{{ JSON.stringify(item.points) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import CanLib from './CanLib/index'
let wrapElem = null
let cElem = null
let sandbox = null // 画布
let bgImage = null // 背景图片类
const ctrlItems = [] // 被选中的覆盖物的顶点圆
const tempItems = [] // 绘制途中产生的临时点线
const rectVertexArr = [['xmin', 'ymin'], ['xmax', 'ymax']] // 矩形的控制点名称
let tempVertex = []
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
      width: 1000,
      height: 1000,
      wrapHeight: 1000,
      curX: 0,
      curY: 0,
      nameDic: {
        polygon: '多边形',
        rect: '矩形'
      },
      canvasCursor: 'default',
      entities: [], // 主要覆盖物
      newPoints: [], // 绘制过程的拾取点
      newEntity: null, // 当前绘制的覆盖物
      activeEntity: null, // 当前激活编辑的覆盖物
      status: 0,
      keyHandler: {}
    }
  },
  computed: {
    tip () {
      if (this.status === 0) {
        return '状态：空闲'
      } else if (this.status === 1) {
        return '画多边形：左键绘制多边形，右键回退，回车确认'
      } else if (this.status === 2) {
        return '画矩形：左键选择矩形的两个对角顶点'
      } else if (this.status === 3) {
        return '编辑：拖动顶点进行编辑，右键返回，Delete删除'
      } else {
        return ''
      }
    }
  },
  mounted () {
    document.addEventListener('keyup', e => {
      this.handleKey(e.key)
    })
    this.initCanvas()
    const img = require('./bg.jpg')
    this.initBgImage(img)
    this.initExistEntities()
  },
  methods: {
    handleKey (key) {
      if (this.keyHandler[key]) {
        for (const callback of this.keyHandler[key].values()) {
          callback()
        }
      }
    },
    addKeyHandler (key, callback) {
      if (!this.keyHandler[key]) {
        this.keyHandler[key] = new Set()
      }
      this.keyHandler[key].add(callback)
    },
    removeKeyHandler (key, callback) {
      if (this.keyHandler[key]) {
        this.keyHandler[key].delete(callback)
      }
    },
    // 初始化
    initCanvas () {
      wrapElem = this.$refs.wrap
      cElem = document.getElementById('canvas-elem')
      sandbox = new CanLib.Sandbox(cElem, { width: 1000, height: 1000 })
      sandbox.on('mousemove', this.setCursorDefault)
      wrapElem.addEventListener('mousedown', this.dragOrNot)
      // 滚轮缩放
      cElem.addEventListener('mousewheel', e => {
        // e.preventDefault()
        // const xRate = `${(e.offsetX / this.initialWidth * 100).toFixed(3)}%`
        // const yRate = `${(e.offsetY / this.initialHeight * 100).toFixed(3)}%`
        // console.log(xRate)
        // console.log(yRate)
        // cElem.style['transform-origin'] = `${xRate} ${yRate}`
        // cElem.style['transform-origin'] = '100% 100%'
        const delta = e.wheelDelta
        if (delta > 0 && this.scale < this.initialScale * 5) {
          this.scale += 0.2
        } else if (delta < 0 && this.scale > this.initialScale) {
          this.scale -= 0.2
        }
      })
    },
    dragOrNot (e) {
      if (this.status !== 0) return
      this.beginMouseX = e.clientX
      this.beginMouseY = e.clientY
      this.beginTransX = this.transX
      this.beginTransY = this.transY
      wrapElem.addEventListener('mousemove', this.moveCanvas)
      wrapElem.addEventListener('mouseup', this.stopMoveCanvas)
      wrapElem.addEventListener('mouseleave', this.stopMoveCanvas)
    },
    moveCanvas (e) {
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
    // 画背景图
    initBgImage (src) {
      return new Promise((resolve, reject) => {
        const image = document.createElement('img')
        image.onload = () => {
          this.width = image.width
          this.height = image.height
          this.initialWidth = image.width
          this.initialHeight = image.height
          sandbox.width = this.width
          cElem.width = this.width
          sandbox.height = this.height
          cElem.height = this.height
          this.wrapHeight = 1000 / this.width * this.height

          this.scale = 1000 / this.width
          this.initialScale = this.scale
          this.$nextTick(() => {
            bgImage = new CanLib.Background({ sandbox, x: 0, y: 0, width: this.width, height: this.height, image })
            sandbox.add(bgImage)
            resolve()
          })
        }
        image.onerror = reject
        image.src = src
      })
    },
    emitUpload () {
      if (this.status !== 0) return
      this.$refs.upload.click()
    },
    setImage () {
      const file = this.$refs.upload.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const imgBase64Data = e.target.result
        const image = document.createElement('img')
        image.onload = () => {
          let w = this.size
          let h = this.size
          if (image.width >= image.height) {
            h = this.size / image.width * image.height
          } else {
            w = this.size / image.height * image.width
          }
          bgImage.width = w
          bgImage.height = h
          bgImage.image = image
        }
        image.src = imgBase64Data
      }
    },
    setVisible (et) {
      et.visible = !et.visible
      if (!et.visible) {
        this.exitEditing()
      }
    },
    initExistEntities () {
      const data = [
        [[127, 226], [152, 228], [158, 242], [157, 254], [144, 256], [113, 256], [113, 242]],
        [[334, 223], [382, 246], [387, 256], [379, 297], [338, 304], [331, 293], [324, 260], [323, 235]]
      ]
      data.forEach(arr => {
        const et = this.drawPolygon({
          color: 'rgba(100, 155, 255, .7)',
          points: arr
        })
        et.on('mousemove', this.setCursorPointer)
        this.entities.push(et)
        et.on('click', e => {
          this.setActiveEntity(et)
        })
      })
    },
    setCursorDefault (e) {
      this.curX = e[0]
      this.curY = e[1]
      this.canvasCursor = 'default'
    },
    setCursorPointer () {
      this.canvasCursor = 'pointer'
    },
    setCursorMove () {
      this.canvasCursor = 'move'
    },
    // 新建多边形部分
    // 开始新建多边形
    addPolygon () {
      if (this.status !== 0) return
      this.status = 1
      this.newPoints = []
      sandbox.on('click', this.pickPolygon, {
        permeate: true
      })
      sandbox.on('contextmenu', this.backstep)
      this.addKeyHandler('Enter', this.completePolygon)
    },
    // 左键拾取顶点
    pickPolygon (e) {
      this.newPoints.push(e)
      const vertex = new CanLib.Circle({
        sandbox,
        x: e[0],
        y: e[1],
        radius: 4 / this.initialScale,
        color: '#409eff'
      })
      sandbox.add(vertex)
      tempItems.push(vertex)
      if (this.newPoints.length === 2) {
        tempVertex = [...e]
        sandbox.on('mousemove', this.mousemovePolygon, {
          permeate: true
        })
        this.newEntity = this.drawPolygon({
          color: 'rgba(100, 155, 255, .7)',
          points: [...this.newPoints, tempVertex]
        })
      } else if (this.newPoints.length > 3 && this.newEntity) {
        this.newEntity.points = [...this.newPoints, tempVertex]
      }
    },
    mousemovePolygon (e) {
      tempVertex = [...e]
      this.newEntity.points = [...this.newPoints, tempVertex]
    },
    // 右键回退
    backstep () {
      if (this.newPoints.length) {
        this.newPoints.pop()
        const vertex = tempItems.pop()
        sandbox.remove(vertex)
        if (this.newEntity) {
          if (this.newPoints.length >= 2) {
            this.newEntity.points = [...this.newPoints, tempVertex]
          } else {
            this.newEntity.destruct()
            this.newEntity = null
            sandbox.off('mousemove', this.mousemovePolygon)
          }
        }
      }
    },
    // 创建多边形
    drawPolygon (params) {
      const polygon = new CanLib.Polygon({
        sandbox,
        points: params.points,
        color: params.color
      })
      sandbox.add(polygon)
      return polygon
    },
    // 回车键 完成新建
    completePolygon (e) {
      sandbox.off('mousemove', this.mousemovePolygon)
      sandbox.off('click', this.pickPolygon)
      sandbox.off('contextmenu', this.backstep)
      this.newEntity.points = [...this.newPoints]
      this.newPoints = []
      tempItems.forEach(v => {
        sandbox.remove(v)
      })
      tempItems.length = 0
      const et = this.newEntity
      et.on('mousemove', this.setCursorPointer)
      this.entities.push(et)
      et.on('click', e => {
        this.setActiveEntity(et)
      })
      this.newEntity = null
      this.removeKeyHandler('Enter', this.completePolygon)
      this.status = 0
    },

    // 新建矩形部分
    // 开始新建矩形
    addRect () {
      if (this.status !== 0) return
      this.status = 2
      this.newPoints = []
      sandbox.on('mousedown', this.startRect)
    },
    startRect (e) {
      this.newPoints = [e]
      const vertex = new CanLib.Circle({
        sandbox,
        x: e[0],
        y: e[1],
        radius: 4 / this.initialScale,
        color: '#409eff'
      })
      sandbox.add(vertex)
      tempItems.push(vertex)
      sandbox.on('mousemove', this.moveRect, {
        permeate: true
      })
      sandbox.on('mouseup', this.endRect, {
        permeate: true
      })
    },
    moveRect (e) {
      this.newPoints[1] = e
      if (this.newPoints[0][0] === e[0] || this.newPoints[0][1] === e[1]) return
      const x1 = this.newPoints[0][0]
      const y1 = this.newPoints[0][1]
      const x2 = this.newPoints[1][0]
      const y2 = this.newPoints[1][1]
      const xmin = x1 < x2 ? x1 : x2
      const xmax = x1 < x2 ? x2 : x1
      const ymin = y1 < y2 ? y1 : y2
      const ymax = y1 < y2 ? y2 : y1
      if (!this.newEntity) {
        this.newEntity = this.drawRect({
          color: 'rgba(100, 205, 110, .7)',
          xmin,
          xmax,
          ymin,
          ymax
        })
      } else {
        this.newEntity.xmin = xmin
        this.newEntity.xmax = xmax
        this.newEntity.ymin = ymin
        this.newEntity.ymax = ymax
      }
    },
    endRect (e) {
      sandbox.off('mousedown', this.startRect)
      sandbox.off('mousemove', this.moveRect)
      sandbox.off('mouseup', this.endRect)
      const et = this.newEntity
      this.newEntity = null
      this.newPoints = []
      tempItems.forEach(v => {
        sandbox.remove(v)
      })
      tempItems.length = 0
      this.status = 0
      setTimeout(() => {
        if (et) {
          et.on('click', e => {
            this.setActiveEntity(et)
          })
        }
      }, 0)
    },
    drawRect (params) {
      const rect = new CanLib.Rect({
        sandbox,
        xmin: params.xmin,
        ymin: params.ymin,
        xmax: params.xmax,
        ymax: params.ymax,
        color: params.color
      })
      sandbox.add(rect)
      rect.on('mousemove', this.setCursorPointer)
      this.entities.push(rect)
      return rect
    },
    // 覆盖物编辑部分
    // 点击一个覆盖物，激活编辑状态
    setActiveEntity (et) {
      if (this.status !== 0) return
      this.status = 3
      this.activeEntity = et
      this.clearCtrlItems()
      sandbox.on('contextmenu', this.exitEditing)
      this.addKeyHandler('Delete', this.handleDelete)
      if (et.entityType === 'polygon') {
        et.points.forEach((pos, index) => {
          const circle = new CanLib.Circle({
            sandbox,
            x: pos[0],
            y: pos[1],
            radius: 6 / this.initialScale,
            color: '#409eff'
          })
          circle.vertexIndex = index
          sandbox.add(circle)
          circle.on('mousemove', this.setCursorMove)
          ctrlItems.push(circle)
          circle.on('mousedown', e => {
            this.activeCircle = circle
            sandbox.on('mousemove', this.moveCircle, {
              permeate: true
            })
            sandbox.on('mouseup', this.circleMouseup)
          })
        })
      } else if (et.entityType === 'rect') {
        rectVertexArr.forEach((nameArr, index) => {
          const circle = new CanLib.Circle({
            sandbox,
            x: et[nameArr[0]],
            y: et[nameArr[1]],
            radius: 6 / this.initialScale,
            color: '#409eff'
          })
          circle.vertexIndex = index
          sandbox.add(circle)
          circle.on('mousemove', this.setCursorMove)
          ctrlItems.push(circle)
          circle.on('mousedown', e => {
            this.activeCircle = circle
            sandbox.on('mousemove', this.moveCircleOfRect, {
              permeate: true
            })
            sandbox.on('mouseup', this.circleMouseupRect)
          })
        })
      }
    },
    // 退出编辑
    exitEditing () {
      this.status = 0
      this.activeEntity = null
      this.clearCtrlItems()
      sandbox.off('contextmenu', this.exitEditing)
    },
    // 删除一个覆盖物
    handleDelete () {
      if (this.status !== 3) return
      const i = this.entities.indexOf(this.activeEntity)
      this.entities.splice(i, 1)
      this.activeEntity.destruct()
      this.activeEntity = null
      this.clearCtrlItems()
      this.status = 0
      this.removeKeyHandler('Delete', this.handleDelete)
    },
    // 多边形，拖拽顶点
    moveCircle (e) {
      const pos = this.activeEntity.points[this.activeCircle.vertexIndex]
      pos[0] = e[0]
      pos[1] = e[1]
      this.activeCircle.x = pos[0]
      this.activeCircle.y = pos[1]
    },
    // 多边形，松起鼠标结束拖拽
    circleMouseup () {
      sandbox.off('mousemove', this.moveCircle)
      sandbox.off('mouseup', this.circleMouseup)
      this.activeCircle = null
    },
    // 矩形，拖拽顶点
    moveCircleOfRect (e) {
      const nameArr = rectVertexArr[this.activeCircle.vertexIndex]
      this.activeEntity[nameArr[0]] = e[0]
      this.activeEntity[nameArr[1]] = e[1]
      this.activeCircle.x = e[0]
      this.activeCircle.y = e[1]
    },
    // 矩形，松起鼠标结束拖拽
    circleMouseupRect () {
      sandbox.off('mousemove', this.moveCircleOfRect)
      sandbox.off('mouseup', this.circleMouseupRect)
      this.activeCircle = null
    },
    // 清除编辑覆盖物的控制点
    clearCtrlItems () {
      ctrlItems.forEach(c => {
        sandbox.remove(c)
      })
      ctrlItems.length = 0
    }
  }
}
</script>
<style lang="less">
.label-page {
  font-size: 14px;
  display: flex; align-items: flex-start;
  .ctrl-section {
    width: 200px;
    .ctrls {
      text-align: center;
      .btn {
        margin: 20px auto;
        width: 100px; height: 30px; line-height: 30px;
        background: #409eff; color: #fff;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer; user-select: none;
      }
    }
  }
  .canvas-section {
    width: 1002px;
    .tip-wrap {
      display: flex; justify-content: flex-end;
      height: 40px; line-height: 40px;
      p {
        margin-left: 40px;
      }
      .tip {
        margin-left: 0;
        margin-right: auto;
        color: #3333ff;
        font-weight: bold;
        text-align: left;
      }
    }
    .wrap {
      display: block;
      width: 1000px;
      overflow: hidden;
      border: 1px solid #333;
      display: flex; justify-content: center; align-items: center;
      #canvas-elem {
        display: block;
      }
    }
  }
  .data-section {
    margin-left: 20px;
    padding-top: 30px;
    text-align: left;
    .data-item {
      margin-bottom: 5px;
      padding: 5px;
      border: 2px solid #fff;
      display: flex;
      &.active {
        border-color: #409eff;
      }
      .checkbox {
        margin-right: 14px;
        position: relative;
        width: 14px; height: 14px;
        border: 1px solid #e2e2e2;
        border-radius: 2px;
        cursor: pointer;
        &.is-checked::after {
          content: '';
          position: absolute; top: 2px; left: 2px;
          width: 10px; height: 10px;
          background: green;
        }
      }
    }
  }
}
</style>
