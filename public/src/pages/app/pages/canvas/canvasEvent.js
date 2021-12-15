export default class CutImageEvent {
  constructor({
    canvas,
    context,
    paintPoints,
    subscribe
  }) {
    this.canvas = canvas
    this.ctx = context
    this.paintPoints = paintPoints
    this.subscribe = subscribe

    // 1. 状态初始化
    this.resetStatus()
    this.cutZone = null

    // 2. 绑定事件
    this.addEventListener()

  }

  /**
   * touch过程的状态标识重置
   */
  resetStatus() {
    this.inCutZone = false
    this.inCtxPath = false

    this.originCutZone = null

    // 初始坐标记录
    this.touch = {
      sx: 0, // start x
      sy: 0, // start y
    }

    // 拖拽的边角方向
    this.dragLineDir = ''
  }

  /**
   * 更新当前的截图区域的信息
   * @param {*} cutZone 
   */
  updateCutZone(cutZone) {
    this.cutZone = cutZone
  }

  /**
   * 通知变更一个截图的点信息
   * @param {*} pointsData 
   */
  publishPointData(pointsData) {
    typeof this.subscribe === 'function' && this.subscribe(pointsData)
  }

  /**
   * 获取相对画布的坐标值
   * @param {*} param0 
   * @returns 
   */
  __mousePointRelateCanvas({ clientX, clientY }) {
    const offsetY = this.canvas.offsetTop
    const offsetX = this.canvas.offsetLeft
    const cw = this.canvas.width
    const ch = this.canvas.height

    // 当前相对于canvas的坐标点
    const currentX = clientX - offsetX
    const currentY = clientY - offsetY

    return {
      x: currentX < 0 ? 0 : (currentX > cw ? cw : currentX),
      y: currentY < 0 ? 0 : (currentY > ch ? ch : currentY)
    }
  }

  /**
   * 判断某个坐标点是否在截图区域
   * @param {*} param0 
   * @returns 
   */
  __inZone({ x, y }) {
    const { x0, y0, width, height } = this.originCutZone
    const x1 = x0 + width
    const y1 = y0 + height
    return x0 <= x && x <= x1 && y0 <= y && y <= y1
  }

  /**
   * 获取最近的截图的点位的坐标信息
   * @param {*} param0 
   * @returns 
   */
  __getRecentlyHotPoint({ x, y }) {
    let temp = Infinity
    let point = null
    this.paintPoints.forEach(i => {
      const { x: pointX, y: pointY } = i
      const d = Math.sqrt((pointX - x) ** 2 + (pointY - y) ** 2)
      temp = d <= temp ? d : temp
      d <= temp && (point = i)
    })
    return point
  }
  
  /**
   * 拖拽截图角落的方向
   * @param {*} param0 
   * @returns 
   */
  __dragCornerLineType({ x, y }) {
    const { x0, y0, width, height } = this.originCutZone
    const halfWidth = width / 2
    const halfHeight = height / 2
    const x1 = x0 + halfWidth
    const y1 = y0 + halfHeight
    // 左上
    if (x < x1 && y < y1) {
      return 'left-up'
    }
    // 右上
    if (x1 < x &&  y < y1) {
      return 'right-up'
    }
    // 右下
    if (x1 < x &&  y1 < y) {
      return 'right-down'
    }
    // 左下
    if (x < x1 &&  y1 < y) {
      return 'left-down'
    }
  }

  /**
   * 拖拽边框返回新的截图坐标信息
   * @param {*} param0 
   * @returns 
   */
  __dragLineCutZoneInfo({ type, dx, dy }) {
    const { x0, y0, width, height } = this.originCutZone
    let nx0 = x0            // new x0
    let ny0 = y0            // new y0
    let nx1 = x0 + width    // new x1
    let ny1 = y0 + height    // new y1

    switch (type) {
      // 左上
      case 'left-up':
        {
          // 1 不变
          nx0 += dx
          ny0 += dy
        }
        break
      // 右上
      case 'right-up':
        {
          // 0 的x 不变
          // 1 的y 不变
          ny0 += dy
          nx1 += dx
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
        }
        break
    }
    const nw = nx1 - nx0
    const nh = ny1- ny0
    return {
      x0: nx0, 
      y0: ny0, 
      width: nw < 50 ? 50 : nw, 
      height: nh < 50 ? 50 : nh
    }
  }

  /**
   * 拖拽的是截图区域，返回一个新的坐标信息
   * @param {*} param0 
   * @returns 
   */
  __dragCutZoneInfo({ dx, dy }) {
    const { x0, y0, width, height } = this.originCutZone
    const nx0 = x0 + dx
    const ny0 = y0 + dy
    return {
      x0: nx0,
      y0: ny0,
      width, height
    }
  }

  /**
   * 绑定画布事件
   */
  addEventListener() {
    this.canvas.addEventListener('touchstart', this.touchstartEvent.bind(this))
    this.canvas.addEventListener('touchmove', this.touchmoveEvent.bind(this))
    this.canvas.addEventListener('touchend', this.touchendEvent.bind(this))
  }

  /**
   * touchstart
   * @param {*} e 
   */
  touchstartEvent(e) {
    const { clientX, clientY } = e.touches[0]
    const { x, y } = this.__mousePointRelateCanvas({ clientX, clientY })

    this.touch.sx = x
    this.touch.sy = y
    this.originCutZone = JSON.parse(JSON.stringify(this.cutZone))
    // 1. 当前点击是否在裁剪的区域
    this.inCutZone = this.__inZone({ x, y })
    // 2. 当前点击是否在绘画的路径上
    this.inCtxPath = this.ctx.isPointInPath(x, y)

    if (this.inCtxPath && !this.inCutZone) {
      // 在绘画路径 && 不再截图区域 === 在热区
      const pointsData = this.__getRecentlyHotPoint({ x, y })
      this.publishPointData(pointsData)
    }

    if (this.inCtxPath && this.inCutZone) {
      // 在路径之上 && 在截图区域 === 在截图的边框
      this.dragLineDir = this.__dragCornerLineType({ x, y })
    }
  }

  /**
   * touchmove
   * @param {*} e 
   */
  touchmoveEvent(e) {
    const { clientX, clientY } = e.touches[0]
    const { x, y } = this.__mousePointRelateCanvas({ clientX, clientY })

    if (this.inCtxPath || this.inCutZone) {
      e.preventDefault()
      const dx = x - this.touch.sx // 中心x移动的距离
      const dy = y - this.touch.sy // 中心y移动的距离

      let pointsData
      // 在四个选择角落
      if (this.inCtxPath && this.inCutZone) {
        pointsData = this.__dragLineCutZoneInfo({ type: this.dragLineDir, dx, dy })
      }

      // 在截图区域
      if (!this.inCtxPath && this.inCutZone) {
        pointsData = this.__dragCutZoneInfo({ dx, dy })
      }

      // 通知修改
      this.publishPointData(pointsData)
    }
  }

  /**
   * touchend
   */
  touchendEvent() {
    this.resetStatus()
  }
}
