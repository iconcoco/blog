<template>
  <div class="clip-image">
    <div
      ref="clipImageContainer"
      class="clip-image__container"
    >
      <!-- 蒙板 -->
      <!-- <div class="clip-image__mask"></div> -->

      <!-- 裁剪 -->
      <cutZone
        ref="clipImageCutZone"
        v-bind="{
          ...clipImageInfo,
          ...cutZone
        }"
        @closeStyleChange="handleClosePreZone"
        @clipZoneChange="handleClipZoneChange"
      />
      
      <!-- 关闭裁剪 -->
      <cutZone
        type="close"
        v-bind="clipImageInfo"
        :close-zone="closeZone"
        :close-style="closeStyle"
      />
      <!-- 热点 -->
      <template v-if="initPoints">
        <span 
          v-for="(item, index) in hotZone"
          :key="index"
          v-show="!hideInZonePoints.includes(index)"
          :style="{
            top: item.y + 'px',
            left: item.x + 'px',
          }"
          class="clip-image__hot-points"
          @click="onHotZoneClick(item)"
        >{{ index }}</span>
      </template>
      <!-- guide -->
      <i
        v-if="showClipGuide"
        class="clip-image__clip-guide"
        :style="textStyle"
      >{{ clipGuide }}</i>

    </div>
  </div>  
</template>

<script>
import { loadImg, clipImage, formattingHotPoints, deScaleCoordinate, enScaleCoordinate, imageBlob } from './utils.js'
import cutZone from './cutZone.vue'
export default {
  name: 'ClipImage',
  components: {
    cutZone
  },
  inheritAttrs: false,
  props: {
    clientWidth: {
      type: Number,
      default: 0
    },
    clientHeight: {
      type: Number,
      default: 0
    },
    blobImage: {
      type: String,
      default: imageBlob
    },
    hotPoints: {
      type: Array,
      default: () => [
        {"x":129.26811249,"y":162.8688348,"width":82.20955149000002,"height":224.36723039999998},
        {"x":66.36025665,"y":65.1245436,"width":159.83523477,"height":115.27290948000002},
        {"x":163.3533498,"y":390.62826959999995,"width":39.72145545000001,"height":43.088939040000014},{"x":128.97874548000001,"y":395.70457932,"width":38.146139009999985,"height":48.29542068000001},
      ]
    },
  },
  data() {
    return {
      image: null,
      initPoints: false,
      hideInZonePoints: [],

      cutZone: {
        outline: 0,
        zone: {}
      },
      showClipGuide: true,
      clipGuide: 'Adjust the box or click the dot to switch the search area',
      textStyle: {},
      closeStyle: {},
      closeZone: {},
      // 给裁剪区域用
      clipImageInfo: {},
      imageScale: 1, // 缩放比例
    }
  },
  computed: {
    hotZone() {
      const data = this.hotPoints.map(i => {
        return enScaleCoordinate(i, this.imageScale)
      })
      return data.map(formattingHotPoints)
    }
  },
  async mounted() {
    const { mw, mh, image } = await this.imageStyle()
    if (!image) return
    this.image = image
    this.clipImageInfo = {
      mw, mh, imgBlog: this.blobImage
    }

    const referer = this.$refs['clipImageContainer']
    referer.appendChild(image)
    const clipImageCutZone = this.$refs['clipImageCutZone']
    // 1. 给裁剪区域通知坐标轴
    if (!clipImageCutZone) return
    clipImageCutZone.init(referer)

    // 2. 初始化点位
    this.initPoints = true
    if (this.clipGuide) this.paintGuide()

    // 3. 通知组件已经初始化完毕外部可以进行绘制裁切等
    this.$nextTick(() => {
      this.$emit('init')
    })
  },
  methods: {
    /**
     * 需要将图片充满容器展示
     */
    async imageStyle() {
      const { mw, mh, image } = await loadImg(this.blobImage)
      const clientWidth = this.clientWidth
      const clientHeight = this.clientHeight
      if (!clientWidth || !clientHeight) return { mw, mh, image }

      const originRadio = clientWidth / clientHeight
      const radio = mw / mh
      let imageW = mw
      let imageH = mh
      if (radio > originRadio) { // 宽图
        imageH = clientHeight
        imageW = radio * clientHeight
      }

      if (radio < originRadio) { // 长图
        imageW = clientWidth
        imageH = clientWidth / radio
      }

      image.style.width = `${imageW}px`
      image.style.height = `${imageH}px`

      this.imageScale = imageW / mw 
      
      return {
        mw: imageW, 
        mh: imageH,
        image
      }
    },
    /**
     * 引导词
     */
    paintGuide() {
      if (!this.hotZone.length || !this.showClipGuide) return
      // 获取坐标最靠左的
      let firstLeftPoint = null
      this.hotZone.forEach(i => {
        if (!firstLeftPoint) {
          return firstLeftPoint = i
        }
        const { x0, y0 } = i
        const { x0: fx0, y0: fy0 } = firstLeftPoint
        if (x0 < fx0 && y0 < fy0 ) {
          firstLeftPoint = i
        }
      })

      const textStyle = {
        display: 'block',
        left: `${firstLeftPoint.x + 10 }px`,
        top: `${firstLeftPoint.y}px`,
        width: `${this.image.width - (firstLeftPoint.x + 10)}px`
      }
      this.textStyle = textStyle
    },
    /**
     * 调用方可能会使用
     * isInnerCall 是否是自己内部调用
     */
    paintZone(points, isInnerCall) {
      // isInnerCall 外部调用点坐标信息跟组件内部需要用的信息不一样，需要进行一次格式化
      const coordinate = isInnerCall ? points : formattingHotPoints(enScaleCoordinate(points, this.imageScale))
      // 如果当前裁剪来自热区，返回的是index
      const index = this.inZoneHotPointIndex(coordinate)
      this.hideInZonePoints = index !== undefined ? [index] : []
      
      this.cutZone.zone = coordinate
    },

    inZoneHotPointIndex(coordinate) {
      // 如果当前裁剪来自热区，返回的是index
      return this.hotZone.findIndex(i => {
        for (const key in coordinate) {
          // 如果发现有不一样
          if (parseInt(coordinate[key]) !== parseInt(i[key])) {
            return false
          }
        }
        return true
      })
    },

    handleClosePreZone({ style, zone }) {
      this.closeStyle = style
      this.closeZone = zone
    },

    handleClipZoneChange({ zone }) {
      this.paintZone(zone, true)
      this.publisher()
    },

    onHotZoneClick(points) {
      this.paintZone(points, true)
      this.publisher(true)
    },

    async publisher(hotZone) {
      const coordinate = deScaleCoordinate(this.cutZone.zone, this.imageScale)
      // 非热区才需要裁剪
      let emitData = {
        coordinate
      }
      if (!hotZone) {
        const { x0, y0, width, height } = coordinate
        const clipInfo = {
          x: x0,
          y: y0,
          width,
          height,
        }
        const imageDataUrl = await clipImage(this.image, clipInfo)
        // 给图片的url
        emitData.clipData = imageDataUrl

      } else {
        // 如果当前裁剪来自热区，返回的是index
        const index = this.inZoneHotPointIndex(enScaleCoordinate(coordinate, this.imageScale))

        // 给图片对应的索引
        emitData.index = index
      }
      // 给外头
      this.$emit('clipImageZone', emitData)

    }
  },
}
</script>

<style lang="scss" scoped>
.clip-image {
  font-size: 0;
  text-align: center;
  overflow: scroll;
  // &__mask {
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   background-color: rgba(0, 0, 0, .6);
  // }
  &__clip-guide {
    display: none;
    position: absolute;
    font-size: 12px;
    color: #fff;
    text-align: left;
    padding-left: 10px;
    transform: translateY(-50%);
  }
  &__container {
    overflow: hidden;
    display: inline-block;
    font-size: 0;
    position: relative;
  }
  &__hot-points {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      top: 0;
      left: 0;
      background-color: #fff;
      animation: pointAnimate 2s infinite;
    }
  }
  
}

@keyframes pointAnimate {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

</style>
