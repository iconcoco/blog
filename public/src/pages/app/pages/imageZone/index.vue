<template>
  <div>
    <clipImage 
      class="container"
      :client-width="375"
      :client-height="400"
      @clipImageZone="getCutImageZone"
    />

    <img 
      class="image"
      :src="clipData" 
      alt=""
    >
  </div>
</template>

<script>
import clipImage from '../common/clipImage/index.vue'
export default {
  name: '',
  components: {
    clipImage
  },
  data() {
    return {
      clipData: null
    }
  },
  methods: {
    getCutImageZone(params) {
      const { coordinate,  clipData, index } = params
      if (typeof index === 'undefined') {
        // 新的截图
        // 1. 画出新的截图
        this.clipData = clipData
        // this.$emit('clipImage', {
        //   clipData,
        //   coordinate
        // })
      } else {
        // 已经有的热图
        // 选中对应的图片
        // this.$emit('clipSelect', index)
        console.log(index);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 400px;
  overflow: scroll;
}
.image {
  margin: 20px auto;
}
</style>