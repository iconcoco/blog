let canvas = null
let context = null

/**
 * 加载image图片并获取对应图片的信息
 * @param {*} imgBlog 
 * @returns 
 */
export const loadImg = (imgBlog) => {
  return new Promise(resolve => {
    let image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous')
    image.onload = () => {
      const info = {
        mw: image.width,
        mh: image.height,
        image,
      }
      resolve(info)
    }
    image.src = `data:image/jpeg;base64,${imgBlog}`
  })
}

/**
 * 裁剪图片
 * @param {*} image 图片文件
 * @param {*} clipInfo 裁剪的信息 { x, y, width, height }
 * @returns 
 */
export const clipImage = (image, clipInfo) => {
  return new Promise(resolve => {
    const { x, y, width, height } = clipInfo
    // 不用重复创建canvas啦
    if (!canvas) {
      canvas = document.createElement('canvas')
      context = canvas.getContext('2d')
    }
  
    canvas.width = width
    canvas.height = height
    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height)
    // 裁剪
    context.drawImage(image, x, y, width, height, 0, 0, width, height)
    resolve(canvas.toDataURL('image/jpeg'))
  })
}
