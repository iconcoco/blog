import { loadImg } from './utils'

export default class Paint {
  constructor({
    canvas,
    context,
    paintPoints,
    imgBlog
  }) {
    this.canvas = canvas
    this.ctx = context
    this.imgBlog = imgBlog
    this.paintPoints = paintPoints

    this.cache = {}
  }

  loaded() {
    return new Promise(resolve => {
      this.__loadImage().then(res => {
        const { mw, mh } = res
        this.canvas.width = mw
        this.canvas.height = mh
        resolve(res)
      })
    })
  }

  /**
   * 获取图片信息
   * @returns 
   */
  async __loadImage() {
    if (this.cache.sourceImg) return this.cache.sourceImg
    const info = await loadImg(this.imgBlog)
    this.cache.sourceImg = info
    return info
  }

  /**
   * 绘制蒙层
   * @param {*} param0 
   */
  __paintMasking({ mw, mh }) {
    // 绘制蒙层
    this.ctx.fillStyle = 'rgba(0, 0, 0, .6)'
    this.ctx.fillRect(0, 0, mw || window.innerWidth, mh || window.innerHeight)
  }

  /**
   * 绘制热区
   */
  __paintHotPoint() {
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.beginPath()
    this.paintPoints.forEach(({ x, y }) => {
      const radius = 7.5 // 圆弧半径
      this.ctx.moveTo(x, y)
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
      this.ctx.fillStyle = '#fff'
      this.ctx.fill()
    })
  }

  __cornerCoordinate({ x0, y0, width, height }) {
    // [上， 右， 下， 左]
    // [x, y]
    return [
      [x0, y0],                   // 左上
      [x0 + width, y0],           // 右上
      [x0 + width, y0 + height],  // 右下
      [x0, y0 + height],          // 左下
    ]
  }

  /**
   * 边角拖拽区域
   * @param {*} cutZone 
   */
  __paintCornerLine(cutZone) {
    this.ctx.globalCompositeOperation = 'source-over'
    const cornerPoint = this.__cornerCoordinate(cutZone) // [上， 右， 下， 左]
    const lineLength = 20
    this.ctx.lineWidth = 4

    // 左上
    const leftUp = cornerPoint[0]
    this.ctx.moveTo(leftUp[0], leftUp[1] + lineLength)
    this.ctx.lineTo(leftUp[0], leftUp[1])
    this.ctx.lineTo(leftUp[0] + lineLength, leftUp[1])

    // 右上
    const rightUp = cornerPoint[1]
    this.ctx.moveTo(rightUp[0] - lineLength, rightUp[1])
    this.ctx.lineTo(rightUp[0], rightUp[1])
    this.ctx.lineTo(rightUp[0], rightUp[1] + lineLength)

    // 右下
    const rightDown = cornerPoint[2]
    this.ctx.moveTo(rightDown[0], rightDown[1] - lineLength)
    this.ctx.lineTo(rightDown[0], rightDown[1])
    this.ctx.lineTo(rightDown[0] - lineLength, rightDown[1])

    // 左下
    const leftDown = cornerPoint[3]
    this.ctx.moveTo(leftDown[0] + lineLength, leftDown[1])
    this.ctx.lineTo(leftDown[0], leftDown[1])
    this.ctx.lineTo(leftDown[0], leftDown[1] - lineLength)

    // 线条颜色
    this.ctx.strokeStyle = '#fff'
    this.ctx.stroke()
  }

  /**
   * 拖拽出的选择截取区域
   * @param {*} cutZone 
   */
  __paintSelectRect(cutZone) {
    const { x0, y0,  width, height } = cutZone
    // ctx.globalCompositeOperation = 'source-atop'
    this.ctx.clearRect(x0 + 1, y0 + 1, width - 2, height - 2)
  }
  
  async paint(cutZone) {
    const { mw, mh, image } = await this.loaded()
    // 1. 清空画布
    this.ctx.clearRect(0, 0, mw, mh)
    // 2. 绘制蒙层
    this.__paintMasking({ mw, mh })
    // 3. 绘制热区点位 / 可点击区域
    this.__paintHotPoint()
    if (cutZone) {
      this.__paintCornerLine(cutZone)
      // 4. 绘制空的选择区域
      this.__paintSelectRect(cutZone)
    }
    this.ctx.globalCompositeOperation = 'destination-over'
    // 5. 再绘制图片
    this.ctx.drawImage(image, 0, 0, mw, mh, 0, 0, mw, mh)
  }
}
