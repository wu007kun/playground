<template>
  <div>
    <date-based-password
      title="请登录"
      defaultPassword="clear!@#"
      @success="handleSuccess"></date-based-password>
  </div>
</template>
<script>
export default {
  methods: {
    handleSuccess () {
      console.log('success')
    }
  }
}
</script>
