<template>
  <div>
    <div class="ctrl-btn" @click="getCapture">capture</div>
    <div class="test-page" ref="test">
      <img src="./test.jpg" class="test-img" alt="">
      <div class="test-line">
        <p>{{ text1 }}</p>
        <p>{{ text2 }}</p>
      </div>
      <img src="./test.jpg" class="test-img" alt="">
      <div class="test-line">
        <p>{{ text3 }}</p>
        <p>{{ text4 }}</p>
      </div>
      <img src="./test.jpg" class="test-img" alt="">
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      text1: '测试文字1',
      text2: '文字测试2',
      text3: '测试的3',
      text4: '4的测试'
    }
  },
  methods: {
    getCapture () {
      html2canvas(this.$refs.test, {
        scale: 2
      }).then((canvas) => {
        const url = canvas.toDataURL('image/png')
        this.createDownload(url)
      })
    },
    createDownload (url) {
      const eleLink = document.createElement('a')
      eleLink.href = url // 转换后的图片地址
      eleLink.download = 'picture'
      document.body.appendChild(eleLink)
      // 触发点击
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }
  }
}
</script>
<style lang="less">
.test-page {
  position: fixed; top: 0; left: 100%;
  width: 1000px;
  height: 2000px;
  .test-img {
    width: 100%;
  }
  .test-line {
    display: flex; justify-content: space-around;
  }
}
</style>
