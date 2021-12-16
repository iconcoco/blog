import CanvasEvent from './canvasEvent'
import CanvasPaint from './canvasPaint'
import { clipImage } from './utils'

/***
 * 拖拽截取图片中的某一个部分
 * 逻辑：
 * 1. 获取图片，宽高
 * 2. 给画布设置宽高
 * 3. 绘制一个蒙板
 * 4. 凿开蒙板，作为一个选择的区域
 * 5. 绘制可以点击选择的点位热区
 * 6. 图片绘制在最底层
 * 
 * 7. 绑定事件，监听事件拖拽等不断重复 1-6 步骤
 */
export default class RectCutImage {
  constructor({
    canvasId = '',
    imgBlog,
    points = [],
    publish,
  }) {
    // 1. 画板初始化
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) return console.info(`未找到 id=${canvasId} 的画布`)
    this.ctx = this.canvas.getContext('2d')
    this.publish = publish
    this.image = null
    this.initCanvas = false
    this.queue = []
    
    // 2. 数据初始化
    if (!points.length) return console.info('缺少截图的坐标信息')
    this.paintPoints = this.__initPointData(points)

    // 3. 事件/实例初始化
    if (!imgBlog) return console.info('缺少图片信息')
    this.eventCenter = new CanvasEvent({
      canvas: this.canvas,
      context: this.ctx,
      paintPoints: this.paintPoints,
      subscribe: this.paintCutZone.bind(this)
    })
    this.paintCenter = new CanvasPaint({
      canvas: this.canvas,
      context: this.ctx,
      paintPoints: this.paintPoints,
      imgBlog,
    })
    this.paintCenter.loaded().then(({ image }) => {
      this.image = image
      this.paintCenter.paint()
      // 队列有没有任务
      if (this.queue.length) {
        this.initCanvas = true
        this.queue.forEach(fn => fn.call(this))
        this.queue = []
      }
    })
  }

  /**
   * 裁剪区域限制
   * @param {*} param0 
   * @param {*} canvas 
   * @returns 
   */
  __cutZoneCoordinate({ x0, y0, width, height }, canvas) {
    const cw = canvas.width // 应该要比的值坐标走
    const ch = canvas.height
    const zx = x0 < 0 ? 0 : ( x0 > cw - width ? cw - width : x0 )
    const zy = y0 < 0 ? 0 : ( y0 > ch - height ? ch - height : y0 )
    return {
      x0: zx, 
      y0: zy,
      width,
      height
    }
  }

  /**
   * 初始化数据，格式化
   * @param {*} points 
   * @returns 
   */
  __initPointData(points) {
    return points.map(this.__forMatData.bind(this))
  }

  __forMatData({ x0, y0, x1, y1 }) {
    const width = x1 - x0
    const height = y1 - y0
    return {
      x: x0 + width / 2, // 中心点 x
      y: y0 + height / 2, // 中心点 Y
      x0, // 左上角点 x
      y0, // 左上角点 y
      x1, // 右下角点 x
      y1, // 右下角点 y
      width,
      height
    }
  }

  /**
   * 绘制截图区域
   * @param {*} data: pointsData 
   * @param {*} hotPoint 当前绘制的是否是热点 
   * @param {*} emit 是否要将但前绘制的点信息通知调用者
   */
  paintCutZone({ data: pointsData, hotPoint = false, emit = false }) {
    const cutZone = this.__cutZoneCoordinate(pointsData, this.canvas)
    this.eventCenter.updateCutZone(cutZone)
    this.paintCenter.paint(cutZone)
    emit && this.publisher(cutZone, hotPoint)
  }

  async publisher(cutZone, hotPoint) {
    const { x0, y0, width, height } = cutZone
    const coordinate = {
      x0,
      y0,
      x1: x0 + width,
      y1: y0 + height,
      width, height
    }
    if (typeof this.publish === 'function') {
      if (hotPoint) {
        // 如果当前裁剪来自热区，返回的是index
        const index = this.paintPoints.findIndex(i => {
          for (const key in cutZone) {
            // 如果发现有不一样
            if (parseInt(cutZone[key]) !== parseInt(i[key])) {
              return false
            }
          }
          return true
        })
        this.publish({
          coordinate,
          index
        })
      } else {
        // 如果是自定义的裁切结果
        // 要返回切割之后的图片
        const clipInfo = {
          x: x0,
          y: y0,
          width,
          height,
        }
        const imageDataUrl =  await clipImage(this.image, clipInfo)
        this.publish({
          coordinate,
          clipData: imageDataUrl
        })
      }
    }
  }

  /**
   * 画一个选择区域
   */
  draw(pointsData) {
    const points = this.__forMatData(pointsData)
    if (!this.initCanvas) {
      return this.queue.push(() => {
        this.paintCutZone({ data: points })
      })
    }
    this.paintCutZone({ data: points })
  }
}
