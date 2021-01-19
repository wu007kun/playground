<template>
  <div class="get-pic">
    <div
      ref="map"
      class="map-elem" id="container"
      :style="{
        width: size + 'px',
        height: size + 'px',
      }"></div>
    <div class="pic-list">
      <img
        class="pic-item"
          v-for="(url, index) in picList"
        :key="index"
        :src="url">
    </div>
  </div>
</template>
<script>
import lngData from './lngData.json'
import html2canvas from 'html2canvas'
let map = null

const start = [121.625577, 31.213692]
// const end = [121.628796, 31.210939]

export default {
  data () {
    return {
      size: 100,
      picList: []
    }
  },
  async mounted () {
    map = new AMap.Map('container', {
      zoom: 16, // 级别
      center: [121.6221, 31.214307] // 中心点坐标
    })
    map.on('complete', () => {
      this.getPics()
    })
  },
  methods: {
    async getPics () {
      for (let i = 0; i < lngData.length; i++) {
        const arr = lngData[i]
        await this.getPicByPos(arr)
      }
    },
    getPicByPos (arr) {
      return new Promise((resolve, reject) => {
        const lt = [arr[0], arr[1]]
        const ltXY = this.convert2(lt)
        map.panBy(ltXY[0] * -1, ltXY[1] * -1)
        setTimeout(() => {
          this.getCapture().then(() => {
            resolve()
          })
        }, 500)
      })
    },
    getCapture () {
      return html2canvas(this.$refs.map, {
        scale: 2
      }).then((canvas) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          this.picList.push(url)
        })
      })
    },
    convert1 ([x, y]) {
      // 构造成 Pixel 对象后传入
      var pixel = new AMap.Pixel(x, y)
      var lnglat = map.containerToLngLat(pixel) // 获得 LngLat 对象
      return [lnglat.lng.toFixed(6) - 0, lnglat.lat.toFixed(6) - 0]
    },
    convert2 ([lng, lat]) {
      // 构造成 LngLat 对象后传入
      var lnglat = new AMap.LngLat(lng, lat)
      var pixel = map.lngLatToContainer(lnglat) // 获得 Pixel 对象
      return [pixel.x.toFixed(3) - 0, pixel.y.toFixed(3) - 0]
    },
    getAllRectData () {
      const startXY = this.convert2(start)
      const size = 100
      const result = []
      for (let i = 0; i < 8; i++) {
        console.log('第' + (i + 1))
        for (let j = 0; j < 8; j++) {
          const xy = [size * j, size * i]
          const realXY = [startXY[0] + xy[0], startXY[1] + xy[1]]
          const realEnd = [realXY[0] + size, realXY[1] + size]
          const pos1 = this.convert1(realXY)
          const pos2 = this.convert1(realEnd)
          const data = [...pos1, ...pos2]
          result.push(data)
        }
      }
      console.log(JSON.stringify(result))
    },
    getSizeByZoom (zoom) {

    }
  }
}
</script>
<style lang="less">
.get-pic {
  padding-top: 100px;
  .map-elem {
    position: absolute; top: 0;
    .amap-logo {
      opacity: 0;
    }
  }
  .pic-list {
    width: 1600px;
    display: flex; flex-wrap: wrap;
    .pic-item {
      width: 200px; height: 200px;
    }
  }
}

</style>
