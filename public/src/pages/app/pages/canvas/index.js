import CanvasEvent from './canvasEvent'
import CanvasPaint from './canvasPaint'

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

    // 4. 画出第一个选择框
    this.paintCutZone(this.paintPoints[0])

  }

  /**
   * 裁剪区域限制
   * @param {*} param0 
   * @param {*} canvas 
   * @returns 
   */
  __cutZoneCoordinate({ x0, y0, width, height }, canvas) {
    const cw = canvas.width
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
    return points.map(({ x0, y0, x1, y1 }) => {
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
    })
  }

  /**
   * 绘制截图区域
   * @param {*} pointsData 
   */
  paintCutZone(pointsData) {
    const cutZone = this.__cutZoneCoordinate(pointsData, this.canvas)
    this.eventCenter.updateCutZone(cutZone)
    this.paintCenter.paint(cutZone)

    typeof this.publish === 'function' && this.publish(cutZone)
  }
}
