<template>
  <div class="home">
    <router-link style="margin: 20px" v-for="link in navs" :key="link.name" :to="link.name">{{ link.name }}</router-link>
  </div>
</template>

<script>
import router from '@/router/index'

export default {
  name: 'Home',
  components: {

  },
  data () {
    return {
      navs: router.getRoutes()
    }
  },
  mounted () {
    console.log(router.getRoutes)
  }
}
</script>
