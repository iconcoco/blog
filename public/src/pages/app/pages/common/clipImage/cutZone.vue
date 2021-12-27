<template>
  <!-- 裁剪 -->
  <div
    class="clip-image__cut-zone"
    :style="{
      ...imageBgStyle,
      ...cutStyle
    }"
    @touchstart.stop="(e) => referer && onClipTouchStard(e)"
    @touchmove.stop.prevent="(e) => referer && onClipTouchMove(e)"
    @touchend.stop="(e) => referer && onClipTouchEnd(e)"
  >
    <!-- corner -->
    <!-- 上右下左 -->
    <template v-if="zone && Object.keys(zone).length || closeZone && Object.keys(closeZone).length">
      <span 
        v-for="i in 4" 
        :key="i" 
        class="clip-image__cut-corner"
        @touchstart="(e) => referer && onCornerTouchStard(e, i)"
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
    type: {
      type: String,
      default: 'select'
    },

    imgBlog: {
      type: String,
      default: ''
    },
    mw: {
      type: [Number, String],
      default: ''
    },
    mh: {
      type: [Number, String],
      default: ''
    },
    zone: {
      type: Object,
      default() {
        return {}
      }
    },

    closeZone: {
      type: Object,
      default() {
        return {}
      }
    },
    closeStyle: {
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

      zoneTransitionDuration: 300,
      // preCutZone: null,
      originCutZone: null,
      touch: {
        sx: 0, // start x
        sy: 0, // start y
      },
      cutStyle: {},
      realtimeZone: null,
      isCornerDrag: false,
      dragCornerType: '',
      imageBgStyle: {}
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
    imgBlog: {
      handler(val) {
        if (val) {
          this.imageBgStyle = this.type === 'select' ? {
            'outline-width': `${ Math.max(this.mw, this.mh) }px`,
            'outline-style': 'solid',
          } : {
            'background-image': `url(data:image/jpeg;base64,${val})`,
            'background-size': `${this.mw}px ${this.mh}px`,
          }
        }
      },
      immediate: true
    },
    closeStyle: {
      handler(val) {
        val && this.$nextTick(() => {
          this.cutStyle = val
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

    animationStep(width) {
      const frameDuration = 1000 / 60
      const animationFrame = this.zoneTransitionDuration / frameDuration
      return width / animationFrame
    },

    /**
     * increase 增大
     * decrease 减小
     */
    animation({ points, step = 6, action = 'increase' }, fun) {
      const { x, y, width, height } = points

      let oWidth = action == 'increase' ? 1 : width
      let oHeight = action == 'increase' ? 1 : height
      const ratio = height / width
      const animation = () => {
        if (action == 'increase') {
          oWidth += step
          oWidth = oWidth >= width ? width : oWidth
        } else {
          oWidth -= step
          oWidth = oWidth < 0 ? 0 : oWidth
        }
        oHeight = ratio * oWidth

        const top = `${y - oHeight / 2}px`
        const left = `${x - oWidth / 2}px`

        fun({
          display: oWidth === 0 ? 'none' : 'block',
          width: `${oWidth}px`,
          height: `${oHeight}px`,
          top,
          left,
        })
        if ((action == 'increase' && oWidth >= width) || (action == 'decrease' && oWidth <= 0)) return
        requestAnimationFrame(animation)
      }
      animation()

    },

    // 关闭的动画
    closeAnimation(points) {
      const step = this.animationStep(points.width)
      this.animation({
        points,
        step, // 每一帧移动的变量 px
        action: 'decrease'
      }, (val) => {
        this.$emit('closeStyleChange', {
          style: Object.assign({}, val, {
            'background-position': `-${val.left} -${val.top}`
          }),
          zone: points, // 关闭的区域点位信息
        })
      })
    },
    
    clipAnimation(points, jump = true) {
      const { x0, y0, width, height } = points
      this.preCutZone = points  // 保存一个前一个裁剪的动画
      // 1. 拖拽实时更新 没有动画
      if (!jump) {
        this.cutStyle = {
          width: `${width}px`,
          height: `${height}px`,
          top: `${y0}px`,
          left: `${x0}px`,
        }
        return
      }

      const step = this.animationStep(width)
      // 2. 点击更新，有动画
      this.animation({
        points,
        step, // 每一帧移动的变量 px
        action: 'increase'
      }, (val) => {
        this.cutStyle = val
      })
    },

    /**
     * 执行裁剪操作
     * jump 选择一个目标跳转到对应指定裁剪区域
     */
    async clip(points, jump = true) {
      const { width, height } = points
      if (!width || !height) return
      let same = !!this.preCutZone
      // 是否需要动画 同一个选择框不需要动画
      if (jump && this.preCutZone) {
        for (const key in this.preCutZone) {
          if (this.preCutZone[key] != points[key]) {
            same = false
          }
        }

        // 关闭前一个剪切的区域
        !same && this.closeAnimation(this.preCutZone)
      }
      this.clipAnimation(points, jump && !same)
    },

    /**
     * 重置在移动过程中的状态
     */
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
      this.realtimeZone && this.$emit('clipZoneChange', {
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
    outline-color: rgba(0, 0, 0, .6);
  }
  &__cut-corner {
    position: absolute;
    max-width: 20px;
    max-height: 20px;
    width: 30%;
    height: 30%;
    background-color: transparent;
    border: 3px solid #fff; 

    &:nth-child(1) {
      left: 0;
      top: 0;
      transform: translate(-3px, -3px);
      border-right: transparent;
      border-bottom: transparent;
    }
    &:nth-child(2) {
      right: 0;
      top: 0;
      transform: translate(3px, -3px);
      border-left: transparent;
      border-bottom: transparent;
    }
    &:nth-child(3) {
      right: 0;
      bottom: 0;
      transform: translate(3px, 3px);
      border-top: transparent;
      border-left: transparent;
    }
    &:nth-child(4) {
      left: 0;
      bottom: 0;
      transform: translate(-3px, 3px);
      border-top: transparent;
      border-right: transparent;
    }
  }
}
</style>
