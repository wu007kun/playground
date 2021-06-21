
export default class Util {
  static judge (poi, coordinates, noneZeroMode) {
    /**
    * @param  poi [x, y] 需要判断的点
    * @param  coordinates [[x1,y1],[x2, y2]] 多边形点坐标的数组
    *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。
    * @param
    */
    // 为保证图形能够闭合，起点和终点必须相等。
    const copy = [...coordinates]
    copy.push(copy[0])
    // 默认启动none zero mode
    noneZeroMode = noneZeroMode || 1
    const x = poi[0]
    const y = poi[1]
    let crossNum = 0
    // 点在线段的左侧数目
    let leftCount = 0
    // 点在线段的右侧数目
    let rightCount = 0
    for (let i = 0; i < copy.length - 1; i++) {
      const start = copy[i]
      const end = copy[i + 1]
      // 起点、终点斜率不存在的情况
      if (start[0] === end[0]) {
        // 因为射线向右水平，此处说明不相交
        if (x > start[0]) continue
        // 从左侧贯穿
        if ((end[1] > start[1] && y >= start[1] && y <= end[1])) {
          leftCount++
          crossNum++
        }
        // 从右侧贯穿
        if ((end[1] < start[1] && y >= end[1] && y <= start[1])) {
          rightCount++
          crossNum++
        }
        continue
      }
      // 斜率存在的情况，计算斜率
      const k = (end[1] - start[1]) / (end[0] - start[0])
      // 交点的x坐标
      const x0 = (y - start[1]) / k + start[0]
      // 因为射线向右水平，此处说明不相交
      if (x > x0) continue
      if ((end[0] > start[0] && x0 >= start[0] && x0 <= end[0])) {
        crossNum++
        if (k >= 0) leftCount++
        else rightCount++
      }
      if ((end[0] < start[0] && x0 >= end[0] && x0 <= start[0])) {
        crossNum++
        if (k >= 0) rightCount++
        else leftCount++
      }
    }
    return noneZeroMode === 1 ? leftCount - rightCount !== 0 : crossNum % 2 === 1
  }

  static poiInCircle (poi, center, radius) {
    const dx = center[0] - poi[0]
    const dy = center[1] - poi[1]
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist <= radius
  }
}
export const rotatePoint = ([x0, y0], [x, y], degree) => {
  degree = degree * Math.PI / 180
  const x1 = (x - x0) * Math.cos(degree) - (y - y0) * Math.sin(degree) + x0
  const y1 = (x - x0) * Math.sin(degree) + (y - y0) * Math.cos(degree) + y0
  return [x1, y1]
}
