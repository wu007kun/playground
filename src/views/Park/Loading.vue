<template>
  <div v-if="loading" class="__loading-mask">
    <div class="loading-inner">
      <p class="loading-text">{{ text }}</p>
      <div class="loading-square">
        <div class="part part1"></div>
        <div class="part part2"></div>
        <div class="part part3"></div>
        <div class="part part4"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '请稍候'
    }
  }
}
</script>
<style>
.__loading-mask {
  position: fixed; top: 0; right: 0; bottom: 0; left: 0;
  background: rgba(0, 0, 0, .5);
  display: flex; justify-content: center; align-items: center;
}
.__loading-mask .loading-inner {
  padding: 30px 100px;
  background: rgba(0, 0, 0, .5);
}
.__loading-mask .loading-text {
  letter-spacing: 3px;
  font-size: 26px;
  color: #efefef;
}
.__loading-mask .loading-square {
  position: relative;
  margin: 30px auto 0;
  width: 30px;
  height: 30px;
  animation-name: example;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
.part {
  position: absolute;
  box-sizing: border-box;
  background: #ccc;
}
.part1 {
  top: 0; left: 0;
  width: 60%; height: 30%;
}
.part2 {
  top: 0; right: 0;
  width: 30%; height: 60%;
}
.part3 {
  bottom: 0; right: 0;
  width: 60%; height: 30%;
}
.part4 {
  bottom: 0; left: 0;
  width: 30%; height: 60%;
}
@keyframes example {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
