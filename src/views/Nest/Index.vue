<template>
  <div class="nest-page">
    <NestedTree v-for="(item, index) in treeData"
      :key="index"
      :data="item"></NestedTree>
    <button @click="saveData">确认</button>
  </div>
</template>
<script>
import NestedTree from './NestedTree'
import { mapState } from 'vuex'
export default {
  components: {
    NestedTree
  },
  data () {
    return {
      data: [
        {
          id: '1',
          name: '1',
          type: 'folder',
          children: [
            {
              id: '1-1',
              name: '1-1',
              type: 'folder',
              children: [
                {
                  id: '1-1-1',
                  name: '1-1-1',
                  type: 'item'
                },
                {
                  id: '1-1-2',
                  name: '1-1-2',
                  type: 'item'
                }
              ]
            },
            {
              id: '1-2',
              name: '1-2',
              type: 'folder',
              children: [
                {
                  id: '1-2-1',
                  name: '1-2-1',
                  type: 'item'
                },
                {
                  id: '1-2-2',
                  name: '1-2-2',
                  type: 'item'
                },
                {
                  id: '1-2-3',
                  name: '1-2-3',
                  type: 'item'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: '2',
          type: 'folder',
          children: []
        }
      ]
    }
  },
  computed: {
    ...mapState(['treeData'])
  },
  mounted () {
    this.$store.commit('initTreeData', this.data)
  },
  methods: {
    saveData () {
      console.log(this.treeData)
    }
  }
}
</script>
<style lang="less">
.nest-page {
  padding: 100px;
}
</style>
