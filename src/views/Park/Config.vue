<template>
  <div class="park-status-config" ref="page">
    <div class="wrap"
      ref="wrap"
      :style="{ width: wrapWidth + 'px', height: wrapHeight + 'px' }">
      <canvas ref="canvas"
        :style="{
          transform: `scale(${scale}) translate(${transX}px, ${transY}px)`
        }"></canvas>
    </div>
    <div class="info-section" style="left: 0; align-items: flex-start">
      <div class="data-section">
        <div class="data-item">
          <label class="label" for="">默认宽度</label>
          <input
            v-model.number="defaultWidth"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">默认高度</label>
          <input
            v-model.number="defaultHeight"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">默认旋转</label>
          <input
            v-model.number="defaultRotate"
            type="number"
          />
        </div>
      </div>
      <div class="create-btns">
        <div class="btn" @click="createByPoint">点击创建</div>
        <div class="btn" @click="createByLine">连线创建</div>
      </div>
      <div class="data-section" v-if="status === 'CREATE_BY_POINT'">
        <p>点击创建</p>
        <div class="data-item">
          <label class="label" for="">deviceID</label>
          <input v-model="activeInfo.deviceID" />
        </div>
        <div class="data-item">
          <label class="label" for="">X</label>
          <input
            v-model.number="activeInfo.x"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">Y</label>
          <input
            v-model.number="activeInfo.y"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">宽度</label>
          <input
            v-model.number="activeInfo.width"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">高度</label>
          <input
            v-model.number="activeInfo.height"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">旋转</label>
          <input
            v-model.number="activeInfo.rotate"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">车型</label>
          <label for="car" class="radio-input">
            <input
              type="radio"
              id="car"
              :value="1"
              @change="updateCarMarker(activeInfo)"
              v-model="activeInfo.type"
            />轿车
          </label>
          <label for="bus" class="radio-input">
            <input
              type="radio"
              id="bus"
              :value="2"
              @change="updateCarMarker(activeInfo)"
              v-model="activeInfo.type"
            />巴士
          </label>
        </div>
        <div class="data-item">
          <div class="btn" @click="saveAdd">保存</div>
          <div class="btn" @click="cancelCurrent">取消</div>
        </div>
      </div>
      <div class="data-section" v-if="status === 'CREATE_BY_LINE'">
        <p>连线创建</p>
        <div class="data-item">
          <label class="label" for="">车位数量</label>
          <input
            v-model.number="lineCarCount"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item" v-if="lineStart">
          <label class="label" for="">起点x</label>
          <input
            v-model.number="lineStart.x"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item" v-if="lineEnd">
          <label class="label" for="">起点y</label>
          <input
            v-model.number="lineStart.y"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item" v-if="lineEnd">
          <label class="label" for="">终点x</label>
          <input
            v-model.number="lineEnd.x"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item" v-if="lineEnd">
          <label class="label" for="">终点y</label>
          <input
            v-model.number="lineEnd.y"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">宽度</label>
          <input
            v-model.number="activeInfo.width"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">高度</label>
          <input
            v-model.number="activeInfo.height"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">旋转</label>
          <input
            v-model.number="activeInfo.rotate"
            @change="updateLineMarker"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">车型</label>
          <label for="car" class="radio-input">
            <input
              type="radio"
              id="car"
              :value="1"
              @change="updateLineMarker"
              v-model="activeInfo.type"
            />轿车
          </label>
          <label for="bus" class="radio-input">
            <input
              type="radio"
              id="bus"
              :value="2"
              @change="updateLineMarker"
              v-model="activeInfo.type"
            />巴士
          </label>
        </div>
        <div class="data-item">
          <div class="btn" @click="saveAddLine">保存</div>
          <div class="btn" @click="cancelCurrent">取消</div>
        </div>
      </div>
    </div>
    <div class="info-section" style="right: 0; align-items: flex-end">
      <div class="tip-wrap">
        <p class="other-tip">当前坐标 {{ curX }}，{{ curY }}</p>
        <p class="other-tip">当前缩放 {{ parseInt(scale * 100) }}%</p>
        <p class="other-tip">
          原始尺寸 {{ initialWidth }} × {{ initialHeight }}
        </p>
        <div class="btn" @click="resetPosition">初始位置</div>
      </div>
      <section class="data-section" v-if="activeInfo.id">
        <p>当前选择</p>
        <div class="data-item">
          <label class="label" for="">deviceID</label>
          <input v-model="activeInfo.deviceID" />
        </div>
        <div class="data-item">
          <label class="label" for="">X</label>
          <input
            v-model.number="activeInfo.x"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">Y</label>
          <input
            v-model.number="activeInfo.y"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">宽度</label>
          <input
            v-model.number="activeInfo.width"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">高度</label>
          <input
            v-model.number="activeInfo.height"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">旋转</label>
          <input
            v-model.number="activeInfo.rotate"
            @change="updateCarMarker(activeInfo)"
            type="number"
          />
        </div>
        <div class="data-item">
          <label class="label" for="">车型</label>
          <label for="car" class="radio-input">
            <input
              type="radio"
              id="car"
              :value="1"
              @change="updateCarMarker(activeInfo)"
              v-model="activeInfo.type"
            />轿车
          </label>
          <label for="bus" class="radio-input">
            <input
              type="radio"
              id="bus"
              :value="2"
              @change="updateCarMarker(activeInfo)"
              v-model="activeInfo.type"
            />巴士
          </label>
        </div>
        <div class="data-item">
          <div class="btn" @click="saveEdit">保存</div>
          <div class="btn" @click="cancelCurrent">取消</div>
          <div class="btn danger" @click="handleDelete">删除</div>
        </div>
      </section>
      <div class="image-section">
        <div class="park-image"
          v-for="item in parkImage"
          :key="item.name"
          @click="setCurrentPark(item)">
          <img class="image" :src="item.src" alt="">
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- <Loading :loading="loading"></Loading> -->
  </div>
</template>
<script>
import { getList, updateInfo, addInfo, deleteInfo } from './api'
import CanLib from '../../canlib/index'
import park1 from './assets/park.jpg'
import park2 from './assets/park2.jpg'
import carImg1 from './assets/car1.png'
import carImg2 from './assets/car2.png'
import busImg from './assets/bus1.png'

let wrapElem = null
let cElem = null
let sandbox = null // 画布
const carMap = new Map() // 用户存储Marker实例
const carTypes = {} // 车型-图片
let highlightBorder = null // 当前小车的高亮框
const lineMarkers = []
function computeSplitPoints (start, end, count) {
  const diffX = (end.x - start.x) / (count - 1)
  const diffY = (end.y - start.y) / (count - 1)
  const points = Array.from({ length: count }).map((i, index) => {
    return [
      start.x + diffX * index,
      start.y + diffY * index
    ]
  })
  return points
}
export default {
  components: {
    // Loading: () => import('./Loading.vue')
  },
  data () {
    return {
      loading: false,
      status: '',
      // canvas基本控制
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
      curX: 0,
      curY: 0,
      // 停车场业务相关
      currentPark: {}, // 当前的停车场
      parkImage: [
        {
          id: 1,
          src: park1,
          name: '1号停车场'
        },
        {
          id: 2,
          src: park2,
          name: '2号停车场'
        }
      ], // 存储不同停车场的信息
      allCarsInfo: [], // 存储当前停车场的车位信息
      activeMarker: null, // 当前选择的车位marker
      activeInfo: { // 当前选择的车位信息
        id: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: 0,
        type: 1,
        deviceID: ''
      },
      originInfo: {}, // 编辑时保存一下原始数据，如取消，则恢复
      tip: '',
      // 新增车位部分
      defaultWidth: 50,
      defaultHeight: 25,
      defaultRotate: 0,
      lineStart: null,
      lineEnd: null,
      lineCarCount: 5
    }
  },
  async mounted () {
    const pageDom = this.$refs.page
    this.pageWidth = pageDom.clientWidth
    this.pageHeight = pageDom.clientHeight
    this.initCanvas()
    if (this.parkImage.length) {
      this.initBgImage(this.parkImage[0].src)
    } else {
      alert('没有停车场图片')
      return
    }
    await this.loadCarImage()
    this.setExistCar(this.parkImage[0].id)
  },
  beforeUnmount () {
    this.destroyCanvas()
  },
  methods: {
    // 创建一个汽车图标
    drawCar (info) {
      const marker = new CanLib.Marker({
        sandbox,
        ...info,
        image: info.type - 0 === 1 ? carTypes.car : carTypes.bus
      })
      sandbox.add(marker)
      return marker
    },
    // 加载小车图标
    loadCarImage () {
      const arr = [
        {
          name: 'active',
          src: carImg2
        },
        {
          name: 'car',
          src: carImg1
        },
        {
          name: 'bus',
          src: busImg
        }
      ]
      return Promise.all(
        arr.map((info) => {
          return new Promise((resolve, reject) => {
            const image = document.createElement('img')
            image.onload = () => {
              resolve()
            }
            image.onerror = reject
            image.src = info.src
            carTypes[info.name] = image
          })
        })
      )
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
      // 鼠标移动设置当前坐标
      sandbox.on('mousemove', this.setCoord, {
        permeate: true
      })
      // 拖动和缩放，在canvas之外也应触发，因此绑定在父级DOM元素上
      wrapElem.addEventListener('mousedown', this.judgeDrag)
      wrapElem.addEventListener('mousewheel', this.handleMouseWheel)
    },
    // 切换停车场
    setCurrentPark (item) {
      if (this.status) return
      this.currentPark = item
      this.initBgImage(item.src)
      this.setExistCar(item.id)
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
      this.resetPosition() // 切换图片后重置一下位置
    },
    setExistCar (id) {
      this.clearCars()
      getList({
        park: id // 北停车场
      }).then((data) => {
        for (const item of data) {
          const params = item
          this.allCarsInfo.push(params)
          const marker = this.drawCar(params)
          carMap.set(item.id, marker)
          marker.on('click', () => {
            this.handleClickCar(params.id)
          })
        }
        setTimeout(() => {
          this.updateRender()
        }, 1000)
      })
    },
    // 清除所有汽车,切换地图时调用
    clearCars () {
      this.tip = ''
      this.activeMarker = null
      this.clearActiveInfo()
      this.clearHighlightBorder()
      this.allCarsInfo = []
      for (const marker of carMap.values()) {
        if (marker && marker instanceof CanLib.Marker) {
          marker.destruct()
        }
      }
      carMap.clear()
    },
    // 清除表单信息
    clearActiveInfo () {
      this.activeInfo = {
        id: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: 0,
        type: 1,
        deviceID: ''
      }
      this.originInfo = {
        id: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: 0,
        type: 1,
        deviceID: ''
      }
    },
    // 清除高亮框
    clearHighlightBorder () {
      if (highlightBorder && highlightBorder instanceof CanLib.Polygon) {
        highlightBorder.destruct()
      }
      highlightBorder = null
      this.updateRender()
    },
    // 编辑部分
    // 点击一个汽车图标
    handleClickCar (id) {
      if (this.status && this.status !== 'EDIT_MARKER') {
        return
      }
      this.cancelCurrent()
      this.status = 'EDIT_MARKER'
      const info = this.allCarsInfo.find((i) => i.id === id)
      const marker = carMap.get(id)
      this.activeInfo = info
      this.originInfo = { ...info }
      this.tip = '修改后请点击保存'
      this.activeMarker = marker
      if (!highlightBorder) {
        highlightBorder = new CanLib.Polygon({
          sandbox,
          points: JSON.parse(JSON.stringify(marker.points)),
          color: 'rgba(40, 150, 220, .4)',
          zIndex: 4
        })
        sandbox.add(highlightBorder)
      } else {
        // 由于切换汽车前必须先取消,会调用clearHighlightBorder,所以实际上不会走这条代码了
        highlightBorder.points = [...marker.points]
      }
      this.updateRender()
    },
    // 按照form修改汽车图标
    updateCarMarker (form) {
      const keys = ['x', 'y', 'width', 'height', 'rotate', 'type']
      if (!this.activeMarker) return
      keys.forEach(key => {
        if (key === 'type') {
          const image = form.type - 0 === 1 ? carTypes.car : carTypes.bus
          this.activeMarker.image = image
        } else {
          this.activeMarker[key] = form[key]
        }
      })
      this.updateRender()
    },
    // 保存编辑
    saveEdit () {
      this.loading = true
      this.status = ''
      updateInfo(this.activeInfo).then((res) => {
        if (res.data.errInfo === 'success') {
          this.tip = '保存成功'
          this.activeMarker = null
          this.cancelCurrent()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除
    handleDelete () {
      const ifConfirmed = confirm('确认删除？')
      if (ifConfirmed && this.activeInfo.id) {
        this.loading = true
        deleteInfo({
          id: this.activeInfo.id
        }).then(res => {
          if (this.activeMarker && this.activeMarker instanceof CanLib.Marker) {
            this.activeMarker.destruct()
            this.activeMarker = null
          }
          this.cancelCurrent()
        }).finally(() => {
          this.loading = false
        })
      } else {

      }
    },
    // 退出当前的新增、编辑状态
    cancelCurrent () {
      this.clearHighlightBorder()
      // 如果是新增、编辑时点击取消，则会清除activeMarker
      // 如果是保存成功，则需要先把activeMarker设为null，再cancelCurrent，这样不会删掉图标
      if (this.status === 'CREATE_BY_POINT' && this.activeMarker && this.activeMarker instanceof CanLib.Marker) {
        this.activeMarker.destruct()
      } else if (this.status === 'CREATE_BY_LINE') {

      } else if (this.status === 'EDIT_MARKER' && this.activeMarker && this.activeMarker instanceof CanLib.Marker) {
        this.updateCarMarker(this.originInfo)
        this.restoreInfo(this.activeInfo, this.originInfo)
      }
      this.lineStart = null
      this.lineEnd = null
      lineMarkers.forEach(m => {
        m.destruct()
      })
      lineMarkers.length = 0
      this.clearActiveInfo()
      this.activeMarker = null
      this.status = ''
      this.updateRender()
    },
    // 取消编辑时恢复数据
    restoreInfo (target, origin) {
      const keys = ['x', 'y', 'width', 'height', 'rotate', 'type', 'deviceID']
      keys.forEach(key => {
        target[key] = origin[key]
      })
    },
    // 新增部分
    createByPoint () {
      if (this.status) return
      this.cancelCurrent()
      this.status = 'CREATE_BY_POINT'
      sandbox.on('click', this.createCar)
    },
    saveAdd () {
      this.loading = true
      addInfo({
        park: this.currentPark.id,
        ...this.activeInfo
      }).then(res => {
        this.cancelCurrent()
        this.setCurrentPark(this.currentPark)
      }).finally(() => {
        this.loading = false
      })
    },
    createCar (e) {
      this.activeInfo = {
        ...this.activeInfo,
        x: e[0],
        y: e[1],
        width: this.defaultWidth,
        height: this.defaultHeight,
        rotate: this.defaultRotate
      }
      this.activeMarker = this.drawCar(this.activeInfo)
      this.updateRender()
      sandbox.off('click', this.createCar)
    },
    // 连线创建
    createByLine () {
      if (this.status) return
      this.cancelCurrent()
      this.status = 'CREATE_BY_LINE'
      this.activeInfo.width = this.defaultWidth
      this.activeInfo.height = this.defaultHeight
      this.activeInfo.rotate = this.defaultRotate
      this.activeInfo.type = 1
      sandbox.on('click', this.pickEndpoint)
    },
    // 点击选择两个端点
    pickEndpoint (e) {
      if (!this.lineStart) {
        this.lineStart = { x: e[0], y: e[1] }
        this.lineEnd = { x: e[0], y: e[1] }
        this.createLineMarker()
        sandbox.on('mousemove', this.moveLine)
        sandbox.enableAutoRender = true
      } else {
        sandbox.off('click', this.pickEndpoint)
        sandbox.off('mousemove', this.moveLine)
        sandbox.enableAutoRender = false
      }
    },
    createLineMarker () {
      const points = computeSplitPoints(this.lineStart, this.lineEnd, this.lineCarCount)
      points.forEach((poi) => {
        const marker = this.drawCar({
          x: poi[0],
          y: poi[1],
          width: this.activeInfo.width,
          height: this.activeInfo.height,
          rotate: this.activeInfo.rotate,
          type: this.activeInfo.type
        })
        lineMarkers.push(marker)
      })
    },
    moveLine (e) {
      this.lineEnd = { x: e[0], y: e[1] }
      this.updateLineMarker()
    },
    updateLineMarker () {
      if (this.lineStart && this.lineEnd) {
        const points = computeSplitPoints(this.lineStart, this.lineEnd, this.lineCarCount)
        const dataLen = points.length
        for (let i = 0; i < dataLen; i++) {
          const poi = points[i]
          if (lineMarkers[i]) {
            lineMarkers[i].x = poi[0]
            lineMarkers[i].y = poi[1]
          } else {
            lineMarkers[i] = this.drawCar({
              x: poi[0],
              y: poi[1],
              width: this.activeInfo.width,
              height: this.activeInfo.height,
              rotate: this.activeInfo.rotate,
              type: this.activeInfo.type
            })
          }
        }
        const markerLen = lineMarkers.length
        if (markerLen > dataLen) {
          for (let i = dataLen; i < markerLen; i++) {
            lineMarkers[i].destruct()
          }
          lineMarkers.length = dataLen
        }
        lineMarkers.forEach((marker, i) => {
          marker.width = this.activeInfo.width
          marker.height = this.activeInfo.height
          marker.rotate = this.activeInfo.rotate
          const image = this.activeInfo.type - 0 === 1 ? carTypes.car : carTypes.bus
          marker.image = image
        })
        this.updateRender()
      }
    },
    async saveAddLine () {
      this.loading = true
      for (const marker of lineMarkers) {
        await addInfo({
          park: this.currentPark.id,
          x: marker.x,
          y: marker.y,
          width: this.activeInfo.width,
          height: this.activeInfo.height,
          rotate: this.activeInfo.rotate,
          type: this.activeInfo.type
        })
      }
      this.cancelCurrent()
      this.setCurrentPark(this.currentPark)
      this.loading = false
    },
    // 更新画布
    updateRender () {
      sandbox.renderAll()
    },
    // 设置当前坐标
    setCoord (e) {
      this.curX = e[0]
      this.curY = e[1]
    },
    // 销毁整个canvas
    destroyCanvas () {
      sandbox.destroy()
      wrapElem.removeEventListener('mousedown', this.judgeDrag)
      wrapElem.removeEventListener('mousewheel', this.handleMouseWheel)
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
      this.setCoord(e)
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
    // 重置位置
    resetPosition () {
      this.transX = 0
      this.transY = 0
      this.scale = this.initialScale
    }
  }
}
</script>
<style lang="less">
.park-status-config {
  width: 100%; height: 100%;
  background: #333;
  color: #fff;
  user-select: none;
  --theme: #409eff;
  --bg: rgba(0, 0, 0, .8);
  .btn {
    padding: 0 10px;
    width: auto;
    height: 24px;
    line-height: 24px;
    background: var(--theme);
    color: #fff;
    font-size: 12px;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
    &.danger {
      background: #EE4455;
    }
  }
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
  .info-section {
    position: absolute; top: 0; bottom: 0;
    display: flex; flex-direction: column;
    pointer-events: none;
    > * {
      pointer-events: auto;
    }
    .create-btns {
      margin-top: 10px;
      width: 300px; box-sizing: border-box;
      padding: 10px; display: flex;
      background: var(--bg);
      .btn {
        margin-right: 10px;
      }
    }
    .tip-wrap {
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
      background: var(--bg);
      .status-tip {
        margin-left: 10px;
        margin-right: auto;
        font-weight: bold;
        text-align: left;
      }
      .other-tip {
        margin-left: 20px;
        input {
          display: inline-block;
          margin: 3px 0 0 2px;
        }
      }
      .btn {
        margin: 0 20px;
      }
    }
    .default-info {
      width: 300px;
      background: var(--bg);
      padding: 10px;
      box-sizing: border-box;
    }
    .data-section {
      width: 300px;
      background: var(--bg);
      padding: 0 10px;
      box-sizing: border-box;
      text-align: left;
      .data-item {
        margin-bottom: 1px;
        height: 30px;
        display: flex;
        align-items: center;
        .label {
          display: inline-block;
          width: 80px;
        }
        .radio-input {
          margin-right: 10px;
          input {
            margin-right: 5px;
          }
        }
        .btn {
          margin-right: 10px;
        }
        .tip {
          margin: 0 0 0 20px;
          font-size: 14px;
        }
      }
    }
    .image-section {
      margin-top: auto;
      background: var(--bg);
      .park-image {
        margin: 10px;
        width: 100px;
        .image {
          width: 100%;
        }
      }
    }
  }
}
</style>
