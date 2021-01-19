<template>
  <div class="gis-page">
    <div class="gis-content" ref="gisElem">
      <div class="pic"
        :style="{
          top: `calc(50% - ${layer.limit / 2}px`,
          left: `calc(50% - ${layer.limit / 2}px`,
          width: layer.limit + 'px',
          height: layer.limit + 'px',
          transform: `translate(${transX}px, ${transY}px)`
        }">
        <div
          class="slice"
          v-for="(item, index) in layer.data"
          :key="index"
          :style="{
            'background-image': `url(${item.img})`,
            width: item.size + 'px',
            height: item.size + 'px'
          }">
          {{ index + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const layers = [
  {
    limit: 400,
    data: new Array(64).fill(null).map(i => ({
      img: require('@/assets/logo.png'),
      size: 50
    }))
  },
  {
    limit: 600,
    data: new Array(64).fill(null).map(i => ({
      img: require('@/assets/logo.png'),
      size: 75
    }))
  },
  {
    limit: 800,
    data: new Array(64).fill(null).map(i => ({
      img: require('@/assets/logo.png'),
      size: 100
    }))
  },
  {
    limit: 1200,
    data: new Array(64).fill(null).map(i => ({
      img: require('@/assets/logo.png'),
      size: 150
    }))
  },
  {
    limit: 1600,
    data: new Array(64).fill(null).map(i => ({
      img: require('@/assets/logo.png'),
      size: 200
    }))
  }
]
export default {
  data () {
    return {
      zoom: 1,
      layer: layers[0],
      dragging: false,
      startX: 0,
      startY: 0,
      transX: 0,
      transY: 0,
      elemW: 0,
      elemH: 0
    }
  },
  mounted () {
    this.listenMouse()
  },
  methods: {
    listenMouse () {
      const elem = this.$refs.gisElem
      this.elemW = elem.clientWidth
      this.elemH = elem.clientHeight
      elem.onmousewheel = this.handleWheel
      elem.onmousedown = this.handleMouseDown
      elem.onmouseup = this.handleMouseUp
      elem.onmousemove = this.handleMouseMove
      elem.onmouseleave = this.handleMouseLeave
    },
    handleWheel (e) {
      e.preventDefault()
      const delta = e.wheelDelta
      if (delta > 0 && this.zoom < 5) {
        this.zoom += 1
      } else if (delta < 0 && this.zoom > 1) {
        this.zoom -= 1
      }
      this.layer = layers[this.zoom - 1]
      if (this.transX < (this.elemW - this.layer.limit) / 2) {
        this.transX = (this.elemW - this.layer.limit) / 2
      }
      if (this.transX > (this.layer.limit - this.elemW) / 2) {
        this.transX = (this.layer.limit - this.elemW) / 2
      }
      if (this.transY < (this.elemH - this.layer.limit) / 2) {
        this.transY = (this.elemH - this.layer.limit) / 2
      }
      if (this.transY > (this.layer.limit - this.elemH) / 2) {
        this.transY = (this.layer.limit - this.elemH) / 2
      }
    },
    getTransAfterWheel () {

    },
    handleMouseDown (e) {
      e.preventDefault()
      this.dragging = true
      this.startX = e.pageX
      this.startY = e.pageY
    },
    handleMouseUp () {
      this.dragging = false
    },
    handleMouseMove (e) {
      if (this.dragging) {
        const diffX = e.pageX - this.startX
        const diffY = e.pageY - this.startY
        if (this.transX + diffX <= (this.layer.limit - this.elemW) / 2 &&
          this.transX + diffX >= (this.elemW - this.layer.limit) / 2) {
          this.transX += diffX
          this.startX = e.pageX
        }
        if (this.transY + diffY <= (this.layer.limit - this.elemH) / 2 && this.transY + diffY >= (this.elemH - this.layer.limit) / 2) {
          this.transY += diffY
          this.startY = e.pageY
        }
      }
    },
    handleMouseLeave () {
      this.dragging = false
    }
  }
}
</script>
<style lang="less">
.gis-page {
  height: 2000px;
  .gis-content {
    position: relative;
    margin: 50px auto;
    width: 400px; height: 400px;
    overflow: hidden;
    .pic {
      position: absolute;
      display: flex; flex-wrap: wrap;
      user-select: none;
      .slice {
        background-size: 100% 100%;
        color: #000; font-size: 20px;
      }
    }
  }
}
</style>
