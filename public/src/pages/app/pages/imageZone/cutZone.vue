<template>
  <!-- 裁剪 -->
  <div
    ref="clipImageCutZone"
    class="clip-image__cut-zone"
    :style="{
      'outline-width': `${outline}px`,
      ...cutStyle
    }"
    @touchstart.stop="onClipTouchStard"
    @touchmove.stop.prevent="onClipTouchMove"
    @touchend.stop="onClipTouchEnd"
  >
    <!-- corner -->
    <!-- 上右下左 -->
    <template v-if="zone && Object.keys(zone).length">
      <span 
        v-for="i in 4" 
        :key="i" 
        class="clip-image__cut-corner"
        @touchstart="(e) => onCornerTouchStard(e, i)"
      ></span>
    </template>
  </div>
</template>

<script>
import { mousePointRelateReferer, formattingHotPoints } from './utils.js'
export default {
  name: 'ClipImageZone',
  inheritAttrs: false,
  props: {
    outline: {
      type: Number,
      default: 0
    },

    zone: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 图片面板
      referer: null,


      originCutZone: null,
      touch: {
        sx: 0, // start x
        sy: 0, // start y
      },
      cutStyle: {},
      realtimeZone: null,
      isCornerDrag: false,
      dragCornerType: '',
    }
  },
  watch: {
    zone: {
      handler(points) {
        points && this.$nextTick(() => {
          this.clip(points, true)
        })
      },
      immediate: true
    },
  },
  methods: {
    init(referer) {
      if (!referer) return
      this.referer = referer
    },

    /**
     * 执行裁剪操作
     */
    clip(points, animate = true) {
      const { x, y, x0, y0, width, height } = points
      animate ? this.$el.classList.add('clip-image__transition') : this.$el.classList.remove('clip-image__transition')
      this.cutStyle = {
        width: `${width}px`,
        height: `${height}px`,
        top: `${animate ? y : y0}px`,
        left: `${animate ? x : x0}px`
      }
    },

    reset() {
      this.isCornerDrag = false
      this.dragCornerType = ''
      this.originCutZone = null,
      this.touch = {
        sx: 0, // start x
        sy: 0, // start y
      }
      this.realtimeZone = null
    },

    /**
     * 裁剪开始
     */
    onClipTouchStard(e) {
      const { clientX, clientY } = e.touches[0]
      const { x, y } = mousePointRelateReferer({ clientX, clientY }, this.referer)
      this.touch.sx = x
      this.touch.sy = y

      this.originCutZone = this.zone ? JSON.parse(JSON.stringify(this.zone)) : null
    },

    /**
     * 裁剪过程
     */
    onClipTouchMove(e) {
      const { clientX, clientY } = e.touches[0]
      const { x, y } = mousePointRelateReferer({ clientX, clientY }, this.referer)

      const dx = x - this.touch.sx // 中心x移动的距离
      const dy = y - this.touch.sy // 中心y移动的距离

      // 获取最新的坐标信息
      if (this.isCornerDrag) {
        this.realtimeZone = this.dragCornerCoordinate({ dx, dy })
      } else {
        this.realtimeZone = this.dragZoneCoordinate({ dx, dy })
      }
      this.clip(this.realtimeZone, false)
    },

    /**
     * 裁剪结束
     */
    onClipTouchEnd() {
      // 通知变更
      this.$emit('clipZoneChange', {
        zone: this.realtimeZone
      })
      // 重置所有状态
      this.reset()
    },

    /**
     * 拖拽四个角落更改大小
     */
    onCornerTouchStard(e, index = 1) {
      const type = ['left-up', 'right-up', 'right-down', 'left-down']
      this.isCornerDrag = true
      this.dragCornerType = type[index - 1]
    },

    /**
     * 拖拽选择框
     */
    dragZoneCoordinate({ dx, dy }) {
      const { x0, y0, width, height } = this.originCutZone
      let nx0 = x0 + dx
      let ny0 = y0 + dy
      const offsetHeight = this.referer.offsetHeight
      const offsetWidth = this.referer.offsetWidth

      // 临界点限制
      nx0 = nx0 < 0 ? 0 : nx0
      ny0 = ny0 < 0 ? 0 : ny0

      nx0 = nx0 > (offsetWidth - width) ?  offsetWidth - width : nx0
      ny0 = ny0 > (offsetHeight - height) ?  offsetHeight - height : ny0

      return formattingHotPoints({
        x: nx0, 
        y: ny0,
        width, height
      })
    },

    /**
     * 拖拽四个角落
     */
    dragCornerCoordinate({ dx, dy }) {
      const { x0, y0, x1, y1 } = this.originCutZone
      let nx0 = x0            // new x0
      let ny0 = y0            // new y0
      let nx1 = x1            // new x1
      let ny1 = y1            // new y1
      const closeDx = 50

      switch (this.dragCornerType) {
        // 左上
        case 'left-up':
          {
            // 1 不变
            nx0 += dx
            ny0 += dy
            nx0 = (nx1 - nx0) < closeDx ? (nx1 - closeDx) : nx0
            ny0 = (ny1 - ny0) < closeDx ? (ny1 - closeDx) : ny0
          }
          break
        // 右上
        case 'right-up':
          {
            // 0 的x 不变
            // 1 的y 不变
            ny0 += dy
            nx1 += dx
            ny0 = (ny1 - ny0) < closeDx ? (ny1 - closeDx) : ny0
          }
          break
        // 右下
        case 'right-down':
          {
            // 0 不变
            nx1 += dx
            ny1 += dy
          }
          break
        // 左下
        case 'left-down':
          {
            // 0 的y 不变
            // 1 的x 不变
            nx0 += dx
            ny1 += dy
            nx0 = (nx1 - nx0) < closeDx ? (nx1 - closeDx) : nx0
          }
          break
      }

      // 对第二个点的临界点限制
      const offsetHeight = this.referer.offsetHeight
      const offsetWidth = this.referer.offsetWidth
      ny1 = ny1 > offsetHeight ? offsetHeight : ny1
      nx1 = nx1 > offsetWidth ? offsetWidth : nx1

      const newWidth = nx1 - nx0 < closeDx ? closeDx : nx1 - nx0
      const newHeight = ny1 - ny0 < closeDx ? closeDx : ny1 - ny0
      return formattingHotPoints({ x: nx0, y: ny0, width: newWidth, height: newHeight })
    }
  },
}
</script>

<style lang="scss" scoped>
.clip-image {
  font-size: 0;
  &__cut-zone {
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    background-color: transparent;
    outline: 100px solid rgba(0, 0, 0, .6);
    &.clip-image__transition {
      transform: translate(-50%, -50%);
      transition: width .5s, height .5s;
    }
  }
  &__cut-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: transparent;
    &::before {
      content: '';
      position: absolute;
      width: 3px;
      height: 100%;
      background-color: #fff;
      top: 0;
      left: 0;
    }
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: #fff;
      top: 0;
      left: 0;
    }

    &:nth-child(1) {
      left: 0;
      top: 0;
      transform: translate(-3px, -3px);
    }
    &:nth-child(2) {
      right: 0;
      top: 0;
      transform: translate(3px, -3px) rotate(90deg);
    }
    &:nth-child(3) {
      right: 0;
      bottom: 0;
      transform: translate(3px, 3px) rotate(180deg);
    }
    &:nth-child(4) {
      left: 0;
      bottom: 0;
      transform: translate(-3px, 3px) rotate(-90deg);
    }
  }
}
</style>
