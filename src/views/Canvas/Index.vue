<template>
  <div class="canvas-page">
    <div class="canvas-section">
      <div class="ctrls">
        <div class="btn" @click="emitUpload">
          替换图片
          <input style="display: none" type="file" ref="upload" @change="setImage">
        </div>
        <div class="btn" @click="addPolygon">画多边形</div>
        <div class="btn" @click="addRect">画矩形</div>
        <p class="tip">{{ tip }}</p>
      </div>
      <div class="wrap">
        <canvas id="canvas-elem" width="500" height="500"></canvas>
      </div>
    </div>
    <div class="data-section">
      <div class="data-item"
        v-for="(item, index) in pointsData"
        :key="index"
        :class="{
          'active': item.active
        }">
        <p>类型：{{ nameDic[item.name] }}</p>
        <p>数据：{{ JSON.stringify(item.data) }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import CanLib from './CanLib/index'
let sandbox = null // 画布
let bgImage = null // 背景图片类
const ctrlItems = [] // 被选中的覆盖物的顶点圆
const tempItems = [] // 绘制途中产生的临时点线
const rectVertexArr = [['xmin', 'ymin'], ['xmax', 'ymax']] // 矩形的控制点名称

export default {
  data () {
    return {
      nameDic: {
        polygon: '多边形',
        rect: '矩形'
      },
      size: 500,
      entities: [], // 主要覆盖物
      newPoints: [], // 绘制过程的拾取点
      newEntity: null, // 当前绘制的覆盖物
      activeEntity: null, // 当前激活编辑的覆盖物
      status: 0,
      keyHandler: {}
    }
  },
  computed: {
    pointsData () {
      return this.entities.map(et => ({
        name: et.entityType,
        active: this.activeEntity === et,
        data: et.points
      }))
    },
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
      const c = document.getElementById('canvas-elem')
      sandbox = new CanLib.Sandbox(c, { width: this.size, height: this.size })
      // 滚轮缩放，暂时不做
      // let level = 1
      // c.onmousewheel = e => {
      //   e.preventDefault()
      //   const delta = e.wheelDelta
      //   if (delta > 0 && level < 3) {
      //     level += 0.1
      //   } else if (delta < 0 && level > 1) {
      //     level -= 0.1
      //   }
      //   c.style.transform = `scale(${level})`
      // }
    },
    // 画背景图
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
          bgImage = new CanLib.Background({ sandbox, x: 0, y: 0, width: w, height: h, image })
          sandbox.add(bgImage)
          resolve()
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
        console.log(imgBase64Data)
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
    initExistEntities () {
      const et = this.drawPolygon({
        color: 'rgba(100, 155, 255, .7)',
        points: [
          [50, 50],
          [100, 40],
          [150, 100],
          [130, 150],
          [50, 200],
          [30, 100]
        ]
      })
      this.entities.push(et)
      et.on('click', e => {
        this.setActiveEntity(et)
      })
    },
    // 新建多边形部分
    // 开始新建多边形
    addPolygon () {
      if (this.status !== 0) return
      this.status = 1
      this.newPoints = []
      sandbox.on('click', this.pickPolygon)
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
        radius: 4,
        color: '#409eff'
      })
      sandbox.add(vertex)
      tempItems.push(vertex)
      if (this.newPoints.length === 3) {
        this.newEntity = this.drawPolygon({
          color: 'rgba(100, 155, 255, .7)',
          points: this.newPoints
        })
      } else if (this.newPoints.length > 3 && this.newEntity) {
        this.newEntity.points = this.newPoints
      }
    },
    // 右键回退
    backstep () {
      if (this.newPoints.length) {
        this.newPoints.pop()
        const vertex = tempItems.pop()
        sandbox.remove(vertex)
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
      sandbox.off('click', this.pickPolygon)
      sandbox.off('contextmenu', this.backstep)
      this.newPoints = []
      tempItems.forEach(v => {
        sandbox.remove(v)
      })
      tempItems.length = 0
      const et = this.newEntity
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
      sandbox.on('click', this.pickRect)
      sandbox.on('contextmenu', this.backstepRect)
    },
    // 左键拾取顶点，当拾取到两点时创建矩形
    pickRect (e) {
      if (this.newPoints.length === 1) {
        if (e[0] !== this.newPoints[0][0] && e[1] !== this.newPoints[0][1]) {
          this.newPoints.push(e)
          const x1 = this.newPoints[0][0]
          const y1 = this.newPoints[0][1]
          const x2 = this.newPoints[1][0]
          const y2 = this.newPoints[1][1]
          const xmin = x1 < x2 ? x1 : x2
          const xmax = x1 < x2 ? x2 : x1
          const ymin = y1 < y2 ? y1 : y2
          const ymax = y1 < y2 ? y2 : y1
          const entity = this.drawRect({
            color: 'rgba(100, 205, 110, .7)',
            xmin,
            xmax,
            ymin,
            ymax
          })
          entity.on('click', e => {
            this.setActiveEntity(entity)
          })
          this.newPoints = []
          tempItems.forEach(v => {
            sandbox.remove(v)
          })
          tempItems.length = 0
          sandbox.off('click', this.pickRect)
          sandbox.off('contextmenu', this.backstepRect)
          this.status = 0
        }
      } else {
        this.newPoints.push(e)
        const vertex = new CanLib.Circle({
          sandbox,
          x: e[0],
          y: e[1],
          radius: 4,
          color: '#409eff'
        })
        sandbox.add(vertex)
        tempItems.push(vertex)
      }
    },
    // 创建矩形
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
      this.entities.push(rect)
      return rect
    },
    // 右键回退一步
    backstepRect () {
      if (this.newPoints.length) {
        this.newPoints.pop()
        const vertex = tempItems.pop()
        sandbox.remove(vertex)
      }
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
            radius: 6,
            color: '#409eff'
          })
          circle.vertexIndex = index
          sandbox.add(circle)
          ctrlItems.push(circle)
          circle.on('mousedown', e => {
            this.activeCircle = circle
            sandbox.on('mousemove', this.moveCircle)
            sandbox.on('mouseup', this.circleMouseup)
          })
        })
      } else if (et.entityType === 'rect') {
        rectVertexArr.forEach((nameArr, index) => {
          const circle = new CanLib.Circle({
            sandbox,
            x: et[nameArr[0]],
            y: et[nameArr[1]],
            radius: 6,
            color: '#409eff'
          })
          circle.vertexIndex = index
          sandbox.add(circle)
          ctrlItems.push(circle)
          circle.on('mousedown', e => {
            this.activeCircle = circle
            sandbox.on('mousemove', this.moveCircleOfRect)
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
      console.log(this.status)
      if (this.status !== 3) return
      console.log('删除前', this.entities)
      const i = this.entities.indexOf(this.activeEntity)
      console.log('索引', i)
      this.entities.splice(i, 1)
      this.activeEntity.destruct()
      this.activeEntity = null
      console.log('删除后', this.entities)
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
.canvas-page {
  font-size: 14px;
  padding: 30px;
  display: flex; align-items: flex-start;
  .ctrls {
    margin-bottom: 10px;
    display: flex;
    .btn {
      background: #409eff; color: #fff;
      margin-right: 10px;
      padding: 3px 6px; font-size: 12px;
      border-radius: 3px;
      cursor: pointer; user-select: none;
    }
    .tip {
      color: #3333ff;
      font-weight: bold;
    }
  }
  .wrap {
    display: block;
    width: 500px; height: 500px;
    overflow: hidden;
    #canvas-elem {
      margin: 0 auto;
      display: block;
      width: 500px; height: 500px;
    }
  }
  .data-section {
    margin-left: 20px;
    padding-top: 30px;
    text-align: left;
    .data-item {
      margin-bottom: 5px;
      padding: 5px;
      border: 2px solid transparent;
      &.active {
        border-color: #409eff;
      }
    }
  }
}
</style>
