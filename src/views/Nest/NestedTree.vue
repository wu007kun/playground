<template>
  <div class="nested-tree" :class="{
    'has-border': data.children && data.children.length
  }">
    <div class="main">
      <div class="name-wrap">
        <input class="name-input" ref="nameInput" type="text" v-if="typing" @blur="changeName" v-model="inputValue">
        <p class="name" v-else @click="typeName">{{ data.name }}</p>
      </div>
      <div class="ctrl">
        <div class="ctrl-item">
          <img src="./folder.png"
            v-if="data.type === 'folder' && !(data.children && data.children[0] && data.children[0].type === 'item')"
            @click="handleAdd('folder')"
            alt="新增目录">
        </div>
        <div class="ctrl-item">
          <img src="./item.png"
            v-if="data.type === 'folder' && !(data.children && data.children[0] && data.children[0].type === 'folder')"
            @click="handleAdd('item')"
            alt="新增项目">
        </div>
        <div class="ctrl-item">
          <img src="./delete.png"
            @click="handleDelete"
            alt="删除">
        </div>
      </div>
    </div>
    <div class="children" v-if="data.children && data.children.length">
      <nested-tree
        v-for="(item, index) in data.children"
        :key="index"
        :data="item">
      </nested-tree>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NestedTree',
  props: {
    data: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        type: 'folder',
        children: []
      })
    }
  },
  data () {
    return {
      typing: false,
      inputValue: ''
    }
  },
  methods: {
    handleAdd (type) {
      this.$store.commit('addToTree', {
        type: type,
        id: this.data.id
      })
    },
    handleDelete () {
      this.$store.commit('deleteFromTree', this.data.id)
    },
    typeName () {
      this.inputValue = this.data.name
      this.typing = true
      this.$nextTick(() => {
        const inputElem = this.$refs.nameInput
        inputElem.focus()
        inputElem.select()
      })
    },
    changeName () {
      if (this.inputValue) {
        this.$store.commit('changeName', {
          id: this.data.id,
          value: this.inputValue
        })
      }
      this.typing = false
    }
  }
}
</script>
<style lang="less">
.nested-tree {
  position: relative;
  display: flex; align-items: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  &.has-border::after {
    content: '';
    position: absolute; top: 0; left: 110px;
    width: 0; height: 100%;
    border-right: 1px solid #ccc;
  }
  .main {
    margin-right: 20px;
    .name-wrap {
      width: 100px; height: 30px;
      .name {
        height: 100%; line-height: 30px;
        border: 1px solid rgb(112, 105, 105); box-sizing: border-box;
      }
      .name-input {
        height: 100%; width: 100%; line-height: 30px;
        text-align: center;
        border-color: #409eff;
        border-width: 1px;
        box-sizing: border-box;
        font-size: 16px;
        &:active, &:focus {
          outline: none;
        }
      }
    }
    .ctrl {
      display: flex; justify-content: space-between;
      .ctrl-item {
        width: 30px; height: 30px;
        cursor: pointer;
        img {
          margin: 3px;
          width: 24px; height: 24px;
        }
      }
    }
  }
}
</style>
