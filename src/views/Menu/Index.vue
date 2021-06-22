<template>
  <div class="menu-page">
    <video class="bg-video dark-in-out"
      ref="video" :src="currentSrc" muted autoplay loop></video>
    <div class="mask"
      :class="{
        'dark-in-out': darkVideo
      }"></div>
    <div class="menu-content">
      <router-link class="menu-item"
        v-for="item in list"
        :key="item.id"
        :to="item.to"
        @mouseenter="setCurrentVideo(item)">
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>
<script>
import labelVideo from './assets/label.webm'
import parkConfigVideo from './assets/parkConfig.webm'
import parkShowVideo from './assets/parkShow.webm'
export default {
  data () {
    return {
      currentSrc: '',
      list: [
        {
          id: 1,
          name: '标注工具',
          src: labelVideo,
          to: '/label'
        },
        {
          id: 2,
          name: '车位配置',
          src: parkConfigVideo,
          to: '/parkConfig'
        },
        {
          id: 3,
          name: '车位展示',
          src: parkShowVideo,
          to: '/parkShow'
        }
      ],
      darkVideo: false
    }
  },
  mounted () {
    this.setCurrentVideo(this.list[0])
  },
  methods: {
    setCurrentVideo (item) {
      if (item.src === this.currentSrc) return
      this.darkVideo = true
      setTimeout(() => {
        this.currentSrc = item.src
        this.darkVideo = false
      }, 300)
      this.$refs.video.playbackRate = 2
      // this.$refs.video.play()
    }
  }
}
</script>
<style lang="less">
.menu-page {
  position: relative;
  height: 100%;
  background: #333;
  .bg-video {
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .mask {
    position: absolute; top: 0; bottom: 0; left: 0; right: 0;
    background-color: rgba(0, 0, 0, .5);
    transition: background-color 0.6s;
    &.dark-in-out {
      background-color: rgba(0, 0, 0, 1);
    }
  }
  .menu-content {
    position: absolute; top: 0; left: 0;
    padding-bottom: 80px; box-sizing: border-box;
    width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: flex-end;
    .menu-item {
      margin: 0 20px;
      border: 5px solid rgba(255, 255, 255, .5);
      width: 250px; height: 80px; line-height: 80px;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      text-decoration: none;
      transition: background 0.3s;
      &:hover {
        background: rgba(80, 120, 255, .5);
      }
    }
  }
}
</style>
